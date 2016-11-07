from django.views.generic import DetailView
from django.views.generic.edit import CreateView

from . import forms, models


class Home(CreateView):
    model = models.Job
    form_class = forms.CreateJobForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['status_form'] = forms.JobStatusForm()
        return context


class JobDetail(DetailView):
    model = models.Job
