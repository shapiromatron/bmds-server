from django.conf import settings
from django.conf.urls import include
from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter

from . import api, views

router = DefaultRouter()
router.register("analysis", api.AnalysisViewset, basename="analysis")

admin_url = f"admin/{settings.ADMIN_URL_PREFIX}/" if not settings.DEBUG else "admin/"
edit_pattern = "analysis/<uuid:pk>/<str:password>/"

urlpatterns = [
    path("api/v1/", include((router.urls, "analysis"), namespace="api")),
    path("", views.Home.as_view(), name="home"),
    path("analysis/<uuid:pk>/", views.AnalysisDetail.as_view(), name="analysis"),
    path(edit_pattern, views.AnalysisDetail.as_view(), name="analysis_edit"),
    path(f"{edit_pattern}renew/", views.AnalysisRenew.as_view(), name="analysis_renew",),
    path(f"{edit_pattern}delete/", views.AnalysisDelete.as_view(), name="analysis_delete",),
    path(f"{admin_url}healthcheck/", views.Healthcheck.as_view(), name="healthcheck",),
    path(admin_url, admin.site.urls),
]

if settings.DEBUG:
    import debug_toolbar

    urlpatterns += (
        path("__debug__/", include(debug_toolbar.urls)),
        path("403/", TemplateView.as_view(template_name="403.html"), name="403"),
        path("404/", TemplateView.as_view(template_name="404.html"), name="404"),
        path("500/", TemplateView.as_view(template_name="500.html"), name="500"),
    )
