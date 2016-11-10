import bmds
from django import forms
import json
import jsonschema

from . import models, schemas


class CreateJobForm(forms.ModelForm):
    class Meta:
        model = models.Job
        fields = ('inputs', )

    def clean_inputs(self):
        data = self.cleaned_data['inputs']

        # ensure data is valid JSON
        try:
            jsoned = json.loads(data)
        except json.decoder.JSONDecodeError:
            raise forms.ValidationError('Invalid format - must be valid JSON.')

        # first-level check
        try:
            jsonschema.validate(jsoned, schemas.base_schema)
        except jsonschema.ValidationError as err:
            raise forms.ValidationError(err.message)

        # check dataset schema
        try:
            datasets = jsoned.get('datasets', [])
            if jsoned['dataset_type'] == bmds.constants.CONTINUOUS:
                schema = schemas.continuous_dataset_schema
            else:
                schema = schemas.dichotomous_dataset_schema
            jsonschema.validate(datasets, schema)
        except jsonschema.ValidationError as err:
            raise forms.ValidationError('Dataset error(s): ' + err.message)

        return data


class JobStatusForm(forms.Form):
    id = forms.CharField()
