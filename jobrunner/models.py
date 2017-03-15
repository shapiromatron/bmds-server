from copy import deepcopy
import bmds
from datetime import timedelta
from django.db import models
from django.conf import settings
from django.core.urlresolvers import reverse
from django.utils.timezone import now
import json
import traceback
import logging
import uuid

from . import xlsx


logger = logging.getLogger(__name__)


class Job(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False)
    inputs = models.TextField()
    outputs = models.TextField(
        blank=True)
    errors = models.TextField(
        blank=True)
    created = models.DateTimeField(
        auto_now_add=True)
    started = models.DateTimeField(
        null=True)
    ended = models.DateTimeField(
        null=True)

    def __str__(self):
        return str(self.id)

    def get_absolute_url(self):
        return reverse('job', args=(str(self.id), ))

    def get_input_url(self):
        return reverse('api:job-inputs', args=(str(self.id), ))

    def get_output_url(self):
        return reverse('api:job-outputs', args=(str(self.id), ))

    def get_excel_url(self):
        return reverse('api:job-excel', args=(str(self.id), ))

    @property
    def is_finished(self):
        return len(self.outputs) > 0 or len(self.errors) > 0

    @property
    def has_errors(self):
        return len(self.errors) > 0

    @classmethod
    def delete_old_jobs(cls):
        oldest_to_keep = now() - timedelta(days=settings.DAYS_TO_KEEP_JOBS)
        qs = cls.objects.filter(created__lt=oldest_to_keep)
        qs.delete()

    @staticmethod
    def build_session(inputs, dataset):

        bmds_version = inputs['bmds_version']
        dataset_type = inputs['dataset_type']
        models = inputs.get('models')
        bmr = inputs.get('bmr')

        # build dataset
        if dataset_type == bmds.constants.CONTINUOUS:
            dataset = bmds.ContinuousDataset(
                doses=dataset['doses'],
                ns=dataset['ns'],
                means=dataset['means'],
                stdevs=dataset['stdevs']
            )
        elif dataset_type == bmds.constants.CONTINUOUS_INDIVIDUAL:
            dataset = bmds.ContinuousIndividualDataset(
                doses=dataset['doses'],
                responses=dataset['responses']
            )
        else:
            dataset = bmds.DichotomousDataset(
                doses=dataset['doses'],
                ns=dataset['ns'],
                incidences=dataset['incidences'],
            )

        # build session
        session = bmds.BMDS.versions[bmds_version](
            dataset_type,
            dataset=dataset
        )

        # get BMR
        global_overrides = {}
        if bmr is not None:
            global_overrides = {
                'bmr': bmr['value'],
                'bmr_type': bmds.constants.BMR_CROSSWALK[dataset_type][bmr['type']],
            }

        # Add models to session
        if models is None:
            session.add_default_models(global_overrides=global_overrides)
        else:
            for model in models:
                overrides = deepcopy(global_overrides)
                if 'settings' in model:
                    overrides.update(model['settings'])
                session.add_model(model['name'], overrides=overrides)

        return session

    @staticmethod
    def get_model_output(model_index, model):
        return

    @property
    def deletion_date(self):
        return self.created + timedelta(days=settings.DAYS_TO_KEEP_JOBS)

    def try_execute(self):
        try:
            self.execute()
        except Exception:
            err = traceback.format_exc()
            self.handle_execution_error(err)

    def try_run_session(self, inputs, dataset, i, recommend):
        try:
            return self.run_session(inputs, dataset, i, recommend)
        except Exception:
            exception = dict(
                dataset=dataset,
                error=traceback.format_exc(),
            )
            logger.error(exception)
            return exception

    def run_session(self, inputs, dataset, i, recommend):

        # build session
        session = self.build_session(inputs, dataset)

        # execute
        session.execute()

        # add model recommendation
        if recommend:
            session.recommend()

        # save output; override default dataset export to optionally
        # include additional metadata in the dataset specified over JSON.
        output = session.to_dict(i)
        output['dataset'] = dataset

        return output

    def execute(self):
        # set start time
        self.started = now()
        self.save()

        inputs = json.loads(self.inputs)

        recommend = inputs.get('recommend', True)

        outputs = [
            self.try_run_session(inputs, dataset, i, recommend)
            for i, dataset in enumerate(inputs['datasets'])
        ]

        inputs_no_datasets = deepcopy(inputs)
        inputs_no_datasets.pop('datasets')
        obj = dict(
            job_id=str(self.id),
            inputs=inputs_no_datasets,
            outputs=outputs,
        )

        self.outputs = json.dumps(obj)
        self.errors = ''
        self.ended = now()
        self.save()

    def handle_execution_error(self, err):
        self.errors = err
        self.ended = now()
        self.save()

    def get_excel(self):
        generator = xlsx.BMDGenerator(self.outputs)
        return generator.get_xlsx()
