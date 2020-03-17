from django.conf import settings
from django.contrib import messages
from django.urls import reverse
from django.views.generic import DetailView, RedirectView
from django.views.generic.edit import CreateView

from . import forms, models


class Home(CreateView):
    model = models.Job
    form_class = forms.CreateJobForm

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
        except Exception:
            messages.info(
                self.request, "Job not found; please try again.", extra_tags="alert alert-warning"
            )
            return reverse("home")


class JobDetail(DetailView):
    model = models.Job
