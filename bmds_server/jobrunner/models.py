import itertools
import json
import logging
import traceback
import uuid
from datetime import timedelta
from typing import Dict, List, Optional

import bmds
from bmds.bmds3.sessions import BmdsSession
from bmds.bmds3.recommender.recommender import RecommenderSettings
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import connection, models
from django.urls import reverse
from django.utils.timezone import now

from . import tasks, transforms, utils, validators

logger = logging.getLogger(__name__)


class Job(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    password = models.CharField(max_length=12, default=utils.random_string, editable=False)
    inputs = models.JSONField(default=dict)
    outputs = models.JSONField(default=dict, blank=True)
    preferences = models.JSONField(default=dict, blank=True)
    errors = models.JSONField(default=dict, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    started = models.DateTimeField(null=True, blank=True)
    ended = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ("created",)
        get_latest_by = ("created",)

    def __str__(self):
        return str(self.id)

    def get_absolute_url(self):
        return reverse("job", args=(str(self.id),))

    def get_api_url(self):
        return reverse("api:job-detail", args=(str(self.id),))

    def get_api_patch_inputs_url(self):
        return reverse("api:job-patch-inputs", args=(str(self.id),))

    def get_api_execute_url(self):
        return reverse("api:job-execute", args=(str(self.id),))

    def get_api_execute_reset_url(self):
        return reverse("api:job-execute-reset", args=(str(self.id),))

    def get_edit_url(self):
        return reverse("job_edit", args=(str(self.id), self.password))

    def get_excel_url(self):
        return reverse("api:job-excel", args=(str(self.id),))

    def get_word_url(self):
        return reverse("api:job-word", args=(str(self.id),))

    def inputs_valid(self) -> bool:
        try:
            validators.validate_input(self.inputs)
        except ValidationError:
            return False
        return True

    @property
    def is_executing(self) -> bool:
        return self.started is not None and self.ended is None

    @property
    def is_finished(self) -> bool:
        return len(self.outputs) > 0 or len(self.errors) > 0

    @property
    def has_errors(self):
        return len(self.errors) > 0

    @classmethod
    def delete_old_jobs(cls):
        oldest_to_keep = now() - timedelta(days=settings.DAYS_TO_KEEP_JOBS)
        qs = cls.objects.filter(created__lt=oldest_to_keep)
        logger.info(f"Removing {qs.count()} old BMDS jobs")
        qs.delete()
        with connection.cursor() as cursor:
            # required for sqlite3 to actually delete data
            cursor.execute("vacuum")

    @classmethod
    def _build_dataset(
        cls, dataset_type: str, dataset: Dict[str, List[float]]
    ) -> bmds.datasets.DatasetType:
        if dataset_type == bmds.constants.Dtype.CONTINUOUS:
            schema = bmds.datasets.ContinuousDatasetSchema
        elif dataset_type == bmds.constants.Dtype.CONTINUOUS_INDIVIDUAL:
            schema = bmds.datasets.ContinuousIndividualDatasetSchema
        elif dataset_type == bmds.constants.Dtype.DICHOTOMOUS:
            schema = bmds.datasets.DichotomousDatasetSchema
        else:
            raise ValueError(f"Unknown dataset type: {dataset_type}")
        return schema.parse_obj(dataset).deserialize()

    @classmethod
    def build_session(cls, inputs: Dict, dataset_index: int, option_index: int) -> bmds.BMDS:
        bmds_version = inputs["bmds_version"]
        dataset_type = inputs["dataset_type"]
        dataset = cls._build_dataset(dataset_type, inputs["datasets"][dataset_index])
        options = inputs["options"][option_index]

        session = bmds.BMDS.version(bmds_version)(dataset=dataset)
        for prior_class, model_names in inputs["models"].items():
            for model_name in model_names:
                if dataset_type in bmds.constants.DICHOTOMOUS_DTYPES:
                    model_options = transforms.bmds3_d_model_options(prior_class, options)
                elif dataset_type in bmds.constants.CONTINUOUS_DTYPES:
                    model_options = transforms.bmds3_c_model_options(prior_class, options)
                else:
                    raise ValueError(f"Unknown dataset_type: {dataset_type}")

                if model_name == bmds.constants.M_Exponential:
                    session.add_model(bmds.constants.M_ExponentialM2, settings=model_options)
                    session.add_model(bmds.constants.M_ExponentialM3, settings=model_options)
                    session.add_model(bmds.constants.M_ExponentialM4, settings=model_options)
                    session.add_model(bmds.constants.M_ExponentialM5, settings=model_options)
                else:
                    session.add_model(model_name, settings=model_options)

        return session

    def get_session(self, index: int) -> BmdsSession:
        if not self.is_finished or self.has_errors:
            raise ValueError("Session cannot be returned")
        return BmdsSession.from_serialized(self.outputs["outputs"][index])

    def update_selection(self, selection: validators.JobSelectedSchema):
        """Given a new selection data schema; update outputs and save instance

        Args:
            selection (validators.JobSelectedSchema): The selection to update
        """
        for idx, output in enumerate(self.outputs["outputs"]):
            if (
                output["metadata"]["dataset_index"] == selection.dataset_index
                and output["metadata"]["option_index"] == selection.option_index
            ):
                session = self.get_session(idx)
                session.selected = selection.selected.deserialize(session)
                self.outputs["outputs"][idx] = self.session_to_output(
                    session, selection.dataset_index, selection.option_index
                )
                self.save()
                break

    @property
    def deletion_date(self):
        return self.created + timedelta(days=settings.DAYS_TO_KEEP_JOBS)

    def try_execute(self):
        try:
            self.execute()
        except Exception:
            err = traceback.format_exc()
            self.handle_execution_error(err)

    def run_session(self, inputs: Dict, dataset_index: int, option_index: int) -> Dict:

        # build session
        session = self.build_session(inputs, dataset_index, option_index)

        # execute
        session.execute()

        # add model recommendation
        default_recommend = True if inputs["bmds_version"] in bmds.constants.BMDS_TWOS else False
        if inputs.get("recommend", default_recommend):
            session.recommend()

        return self.session_to_output(session, dataset_index, option_index)

    def session_to_output(self, session, dataset_index: int, option_index: int) -> Dict:
        output = session.to_dict()
        output["metadata"] = dict(dataset_index=dataset_index, option_index=option_index)
        return output

    def try_run_session(self, inputs: Dict, dataset_index: int, option_index: int) -> Dict:
        try:
            return self.run_session(inputs, dataset_index, option_index)
        except Exception:
            exception = dict(dataset_index=dataset_index, error=traceback.format_exc())
            logger.error(exception)
            return exception

    def start_execute(self):
        # update model to indicate execution scheduled
        self.started = now()
        self.ended = None
        self.save()

        # add to job queue...
        tasks.try_execute.delay(str(self.id))

    def execute(self):
        # update start time to actual time started
        self.started = now()

        combinations = itertools.product(
            *[range(len(self.inputs["datasets"])), range(len(self.inputs["options"]))]
        )
        outputs = [
            self.try_run_session(self.inputs, dataset_index, option_index)
            for dataset_index, option_index in combinations
        ]

        obj = dict(job_id=str(self.id), outputs=outputs)
        self.outputs = obj
        self.errors = [out["error"] for out in outputs if "error" in out]
        self.ended = now()
        self.save()

    def reset_execution(self):
        """
        Update all modeling results and execution fields to a state where the job has not yet been
        executed.
        """
        self.started = None
        self.ended = None
        self.outputs = {}
        self.errors = {}

    def handle_execution_error(self, err):
        self.errors = err
        self.ended = now()
        self.save()

    def get_outputs_json(self) -> Optional[Dict]:
        # TODO - revisit the NaN replacement issue...
        if self.is_finished and self.outputs:
            outputs = (
                self.outputs.replace("NaN", "0")
                .replace("-Infinity", "-999")
                .replace("Infinity", "999")
            )
            return json.loads(outputs)
        return None

    def default_input(self) -> Dict:
        return {
            "bmds_version": "BMDS330",
            "dataset_type": "D",
            "logic": RecommenderSettings.build_default().dict(),
            "models": {},
            "options": [],
            "datasets": [],
        }
