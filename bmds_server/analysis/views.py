import json

from django.conf import settings
from django.http.response import JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404
from django.template import RequestContext, Template
from django.views.generic import CreateView, DetailView, RedirectView, View

from . import forms, models


class Healthcheck(View):
    """
    Healthcheck view check; ensure django server can serve requests.
    """

    def get(self, request, *args, **kwargs):
        # TODO - add cache check and celery worker check
        return JsonResponse({"status": "ok"})


class Home(CreateView):
    model = models.Analysis
    form_class = forms.CreateAnalysisForm
    template_name = "analysis/home.html"

    def get_success_url(self):
        return self.object.get_edit_url()

    def _render_template(self, extra):
        context = RequestContext(self.request, extra)
        content = models.Content.get_cached_content(models.ContentType.HOMEPAGE)
        return Template(content["template"]).render(context)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["days_to_keep_analyses"] = settings.DAYS_TO_KEEP_ANALYSES
        context["page"] = self._render_template(context)
        return context


class AnalysisDetail(DetailView):
    model = models.Analysis

    def get_object(self, queryset=None):
        kwargs = dict(pk=self.kwargs.get("pk"), password=self.kwargs.get("password"))
        if kwargs["password"] is None:
            kwargs.pop("password")
        self.edit_mode = "password" in kwargs
        return get_object_or_404(self.model, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        config = {
            "apiUrl": self.object.get_api_url(),
            "url": self.object.get_absolute_url(),
            "excelUrl": self.object.get_excel_url(),
            "wordUrl": self.object.get_word_url(),
        }
        if self.edit_mode:
            config["editSettings"] = {
                "csrfToken": get_token(self.request),
                "editKey": self.object.password,
                "viewUrl": self.request.build_absolute_uri(self.object.get_absolute_url()),
                "editUrl": self.request.build_absolute_uri(self.object.get_edit_url()),
                "renewUrl": self.request.build_absolute_uri(self.object.get_renew_url()),
                "patchInputUrl": self.object.get_api_patch_inputs_url(),
                "executeUrl": self.object.get_api_execute_url(),
                "executeResetUrl": self.object.get_api_execute_reset_url(),
                "deleteDateStr": self.object.deletion_date_str,
                "deletionDaysUntilDeletion": self.object.days_until_deletion,
            }
        context["config"] = json.dumps(config, indent=2)
        return context


class AnalysisRenew(RedirectView):
    """Renew the current analysis and redirect back to editing"""

    def get_redirect_url(self, *args, **kwargs):
        analysis = get_object_or_404(models.Analysis, **kwargs)
        analysis.renew()
        analysis.save()
        return analysis.get_edit_url()
