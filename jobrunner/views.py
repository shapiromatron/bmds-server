from django.contrib import messages
from django.contrib.auth.decorators import permission_required
from django.core.urlresolvers import reverse
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.generic import RedirectView, DetailView, View
from django.views.generic.edit import CreateView
import json

from bmds.drunner import BatchDfileRunner

from . import forms, models


class Home(CreateView):
    model = models.Job
    form_class = forms.CreateJobForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['status_form'] = forms.JobStatusForm()
        return context


class JobQuery(RedirectView):

    def get_redirect_url(self, *args, **kwargs):
        id_ = self.request.GET.get('id')
        try:
            return models.Job.objects.get(id=id_).get_absolute_url()
        except Exception:
            messages.info(
                self.request,
                'Job not found; please try again.',
                extra_tags='alert alert-warning'
            )
            return reverse('home')


class JobDetail(DetailView):
    model = models.Job


class BatchDFileExecute(View):
    # BLOCKING BMDS execution (for testing only)

    def post(self, request, *args, **kwargs):
        payload = json.loads(request.POST.get('inputs'))
        runner = BatchDfileRunner(payload)
        output = runner.execute()
        return JsonResponse(output, safe=False)
