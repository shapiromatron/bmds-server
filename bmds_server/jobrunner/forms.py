from typing import Tuple

from django import forms

from . import models


class CreateJobForm(forms.ModelForm):
    class Meta:
        model = models.Job
        fields: Tuple[str, ...] = ()


class JobStatusForm(forms.Form):
    id = forms.CharField()
