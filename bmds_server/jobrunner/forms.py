from typing import Tuple

from django import forms

from . import models


class CreateJobForm(forms.ModelForm):
    class Meta:
        model = models.Job
        fields: Tuple[str, ...] = ()

    def save(self, commit=True):
        self.instance.inputs = self.instance.default_input()
        return super().save(commit=commit)
