from django.conf import settings
from django.conf.urls import include
from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter

from . import api, views

router = DefaultRouter()
router.register("analysis", api.AnalysisViewset, basename="analysis")

admin_url = f"admin/{settings.ADMIN_URL_PREFIX}/" if not settings.DEBUG else "admin/"

urlpatterns = [
    path("api/v1/", include((router.urls, "analysis"), namespace="api")),
    path("", views.Home.as_view(), name="home"),
    path("analysis/<uuid:pk>/", views.AnalysisDetail.as_view(), name="analysis"),
    path(
        "analysis/<uuid:pk>/<str:password>/", views.AnalysisDetail.as_view(), name="analysis_edit"
    ),
    path(
        "analysis/<uuid:pk>/<str:password>/renew/",
        views.AnalysisRenew.as_view(),
        name="analysis_renew",
    ),
    path(f"{admin_url}healthcheck/", views.Healthcheck.as_view(), name="healthcheck",),
    path(admin_url, admin.site.urls),
]

if settings.DEBUG:
    import debug_toolbar

    urlpatterns += (path("__debug__/", include(debug_toolbar.urls)),)
