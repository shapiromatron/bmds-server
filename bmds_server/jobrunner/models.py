import json
import logging
import traceback
import uuid
from copy import deepcopy
from datetime import timedelta
from typing import Dict, List, Optional

import bmds
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

    def get_api_patch_inputs(self):
        return reverse("api:job-patch-inputs", args=(str(self.id),))

    def get_api_execute_url(self):
        return reverse("api:job-execute", args=(str(self.id),))

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
        if dataset_type == bmds.constants.CONTINUOUS:
            return bmds.ContinuousDataset(
                doses=dataset["doses"],
                ns=dataset["ns"],
                means=dataset["means"],
                stdevs=dataset["stdevs"],
            )
        elif dataset_type == bmds.constants.CONTINUOUS_INDIVIDUAL:
            return bmds.ContinuousIndividualDataset(
                doses=dataset["doses"], responses=dataset["responses"]
            )
        elif dataset_type == bmds.constants.DICHOTOMOUS:
            return bmds.DichotomousDataset(
                doses=dataset["doses"], ns=dataset["ns"], incidences=dataset["incidences"]
            )
        else:
            raise ValueError(f"unknown dataset type: {dataset_type}")

    @classmethod
    def build_bmds3_session(
        cls, bmds_version: str, dataset_type: str, dataset: bmds.datasets.DatasetType, inputs: Dict
    ) -> bmds.BMDS:
        """
        Puts all options and models into a single BMDS session.
        """
        session = bmds.BMDS.version(bmds_version)(dataset_type, dataset=dataset)
        for options in inputs["options"]:
            for model_class, model_names in inputs["models"].items():
                for model_name in model_names:
                    if dataset_type in bmds.constants.DICHOTOMOUS_DTYPES:
                        model_options = transforms.bmds3_d_model_options(options)
                    elif dataset_type in bmds.constants.CONTINUOUS_DTYPES:
                        model_options = transforms.bmds3_c_model_options(options)
                    else:
                        raise ValueError(f"Unknown dataset_type: {dataset_type}")
                    session.add_model(model_name, settings=model_options)
        return session

    @classmethod
    def build_session(cls, inputs: Dict, dataset: Dict) -> bmds.BMDS:
        bmds_version = inputs["bmds_version"]
        dataset_type = inputs["dataset_type"]

        dataset = cls._build_dataset(dataset_type, dataset)

        if bmds_version in bmds.constants.BMDS_THREES:
            session = cls.build_bmds3_session(bmds_version, dataset_type, dataset, inputs)
        else:
            raise ValueError(f"Unknown bmds_version: {bmds_version}s")

        return session

    @property
    def deletion_date(self):
        return self.created + timedelta(days=settings.DAYS_TO_KEEP_JOBS)

    def try_execute(self):
        try:
            self.execute()
        except Exception:
            err = traceback.format_exc()
            self.handle_execution_error(err)

    def run_session(self, inputs: Dict, dataset: Dict, i: int):

        # build session
        session = self.build_session(inputs, dataset)

        # execute
        session.execute()

        # add model recommendation
        default_recommend = True if inputs["bmds_version"] in bmds.constants.BMDS_TWOS else False
        if inputs.get("recommend", default_recommend):
            session.recommend()

        # save output; override default dataset export to optionally
        # include additional metadata in the dataset specified over JSON.
        output = session.to_dict(i)
        output["dataset"] = dataset

        return output

    def try_run_session(self, inputs: Dict, dataset: Dict, i: int) -> Dict:
        try:
            return self.run_session(inputs, dataset, i)
        except Exception:
            exception = dict(dataset=dataset, error=traceback.format_exc())
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

        outputs = [
            self.try_run_session(self.inputs, dataset, i)
            for i, dataset in enumerate(self.inputs["datasets"])
        ]

        inputs_no_datasets = deepcopy(self.inputs)
        inputs_no_datasets.pop("datasets")
        obj = dict(job_id=str(self.id), inputs=inputs_no_datasets, outputs=outputs)
        self.outputs = obj
        self.errors = [out["error"] for out in outputs if "error" in out]
        self.ended = now()
        self.save()

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
