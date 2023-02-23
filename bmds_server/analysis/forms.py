from django import forms

from . import models


class CreateAnalysisForm(forms.ModelForm):
    class Meta:
        model = models.Analysis
        fields: tuple[str, ...] = ()

    def save(self, commit=True):
        self.instance.inputs = self.instance.default_input()
        return super().save(commit=commit)
