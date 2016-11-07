from django import forms

from . import models


class CreateJobForm(forms.ModelForm):
    class Meta:
        model = models.Job
        fields = ('inputs', )


class JobStatusForm(forms.Form):
    id = forms.CharField()
