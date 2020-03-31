import json

from django.conf import settings
from django.contrib import messages
from django.core.exceptions import ValidationError
from django.urls import reverse
from django.views.generic import CreateView, DetailView, RedirectView

from . import forms, models


class Home(CreateView):
    model = models.Job
    form_class = forms.CreateJobForm

    def get_success_url(self):
        return self.object.get_edit_url()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["status_form"] = forms.JobStatusForm()
        context["days_to_keep_jobs"] = settings.DAYS_TO_KEEP_JOBS
        return context


class JobQuery(RedirectView):
    def get_redirect_url(self, *args, **kwargs):
        id_ = self.request.GET.get("id")
        try:
            return models.Job.objects.get(id=id_).get_absolute_url()
        except (models.Job.DoesNotExist, ValidationError):
            messages.info(
                self.request,
                "BMDS session not found; ID may be invalid or may have been deleted.",
                extra_tags="alert alert-warning",
            )
            return reverse("home")


class JobDetail(DetailView):
    model = models.Job

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        edit_mode = self.request.GET.get("editKey") == self.object.password
        config = {
            "apiUrl": self.object.get_api_url(),
            "url": self.object.get_absolute_url(),
        }
        if edit_mode:
            config["editSettings"] = {
                "editKey": self.object.password if edit_mode else None,
                "allowDatasetEditing": True,
                "allowBmdsVersionEditing": True,
            }
        context["config"] = json.dumps(config, indent=2)
        return context
