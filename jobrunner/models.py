from copy import deepcopy
import bmds
import json
from django.db import models
from django.core.urlresolvers import reverse
from django.utils.timezone import now
import uuid

from . import xlsx


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

    @property
    def is_finished(self):
        return len(self.outputs) > 0 or len(self.errors) > 0

    @property
    def has_errors(self):
        return len(self.errors) > 0

    @staticmethod
    def build_session(bmds_version, dataset_type, dataset, models, bmr):
        # build dataset
        if dataset_type == bmds.constants.CONTINUOUS:
            dataset = bmds.ContinuousDataset(
                doses=dataset['doses'],
                ns=dataset['ns'],
                responses=dataset['responses'],
                stdevs=dataset['stdevs']
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

        # by default, use all available models
        if models is None:
            session.add_default_models()
        else:
            for model in models:
                overrides = global_overrides
                settings = model.get('settings')
                if settings:
                    overrides = deepcopy(global_overrides)
                    overrides.update(settings)
                session.add_model(model['name'], overrides=overrides)

        return session

    @staticmethod
    def get_model_output(model):
        output = dict(
            dfile=model.as_dfile(),
            name=model.model_name,
            has_output=model.output_created,
        )
        if model.output_created:
            output.update(dict(
                outfile=model.outfile,
                output=model.output
            ))
        if hasattr(model, 'logic_bin'):
            output.update(dict(
                logic_bin=model.logic_bin,
                logic_notes=model.logic_notes,
                recommended=model.recommended,
                recommended_variable=model.recommended_variable
            ))

        return output

    def execute(self):
        # set start time
        self.started = now()
        self.save()

        inputs = json.loads(self.inputs)
        outputs = []

        recommend = inputs.get('recommend', True)
        for dataset in inputs['datasets']:

            # build session
            session = self.build_session(
                bmds_version=inputs['bmds_version'],
                dataset_type=inputs['dataset_type'],
                dataset=dataset,
                models=inputs.get('models'),
                bmr=inputs.get('bmr'),
            )

            # execute
            session.execute()

            if recommend:
                recommended_model_index = None
                session.add_recommender()
                recommended_model = session.recommend()
                if recommended_model:
                    recommended_model_index = session.models.index(recommended_model)

            output = dict(
                dataset=dataset,
                models=[
                    self.get_model_output(model)
                    for model in session.models
                ]
            )
            if recommend:
                output['recommended_model_index'] = recommended_model_index

            outputs.append(output)

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
        generator = xlsx.XLSXGenerator(self.outputs)
        return generator.get_xlsx()
