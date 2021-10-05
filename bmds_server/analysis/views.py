from typing import Optional, Tuple

from django.conf import settings
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404
from django.template import RequestContext, Template
from django.urls import reverse_lazy
from django.views.generic import CreateView, DeleteView, DetailView, RedirectView

from . import forms, models
from .utils import get_citation


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
        context["citation"] = get_citation()
        context["page"] = self._render_template(context)
        return context


def get_analysis_or_404(pk: str, password: Optional[str] = "") -> Tuple[models.Analysis, bool]:
    """Return an analysis object and if a correct password is provided for this object.

    Args:
        pk (str): The UUID for the analysis
        password (Optional[str]): A edit password for this analysis

    Returns:
        Tuple[models.Analysis, bool]: An analysis object and if it has a correct password

    Raises:
        Http404: if the selected object cannot be found
    """
    filters = dict(pk=pk)
    if password:
        filters["password"] = password
    analysis = get_object_or_404(models.Analysis, **filters)
    return analysis, "password" in filters


class AnalysisDetail(DetailView):
    model = models.Analysis

    def get_object(self, queryset=None):
        analysis, can_edit = get_analysis_or_404(self.kwargs["pk"], self.kwargs.get("password"))
        self.can_edit = can_edit
        return analysis

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["config"] = {
            "apiUrl": self.object.get_api_url(),
            "url": self.object.get_absolute_url(),
            "excelUrl": self.object.get_excel_url(),
            "wordUrl": self.object.get_word_url(),
            "isFuture": bool(self.request.GET.get("future")),
        }
        if self.can_edit:
            context["config"]["editSettings"] = {
                "csrfToken": get_token(self.request),
                "editKey": self.object.password,
                "viewUrl": self.request.build_absolute_uri(self.object.get_absolute_url()),
                "editUrl": self.request.build_absolute_uri(self.object.get_edit_url()),
                "renewUrl": self.request.build_absolute_uri(self.object.get_renew_url()),
                "deleteUrl": self.request.build_absolute_uri(self.object.get_delete_url()),
                "patchInputUrl": self.object.get_api_patch_inputs_url(),
                "executeUrl": self.object.get_api_execute_url(),
                "executeResetUrl": self.object.get_api_execute_reset_url(),
                "deleteDateStr": self.object.deletion_date_str,
                "deletionDaysUntilDeletion": self.object.days_until_deletion,
            }
        return context


class AnalysisRenew(RedirectView):
    """Renew the current analysis and redirect back to editing"""

    def get_redirect_url(self, *args, **kwargs):
        analysis, _ = get_analysis_or_404(self.kwargs["pk"], self.kwargs["password"])
        analysis.renew()
        analysis.save()
        return analysis.get_edit_url()


class AnalysisDelete(DeleteView):
    """Delete the current analysis"""

    model = models.Analysis
    success_url = reverse_lazy("home")

    def get_object(self, queryset=None):
        analysis, _ = get_analysis_or_404(self.kwargs["pk"], self.kwargs["password"])
        return analysis
