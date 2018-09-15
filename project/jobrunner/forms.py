from django import forms

from . import models, validators


class CreateJobForm(forms.ModelForm):
    class Meta:
        model = models.Job
        fields = ("inputs",)

    def clean_inputs(self):
        data = self.cleaned_data["inputs"]

        try:
            validators.validate_input(data)
        except ValueError as err:
            raise forms.ValidationError(err)

        return data


class JobStatusForm(forms.Form):
    id = forms.CharField()
