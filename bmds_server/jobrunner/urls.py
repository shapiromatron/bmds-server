from django.conf import settings
from django.conf.urls import include
from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter

from . import api, views

router = DefaultRouter()
router.register("job", api.JobViewset, basename="job")

admin_url = f"{settings.ADMIN_URL_PREFIX}/admin/" if not settings.DEBUG else "admin/"

urlpatterns = [
    path("api/v1/", include((router.urls, "jobrunner"), namespace="api")),
    path("", views.Home.as_view(), name="home"),
    path("job/q/", views.JobQuery.as_view(), name="job_query"),
    path("job/<uuid:pk>/", views.JobDetail.as_view(), name="job"),
    path("job/<uuid:pk>/<str:password>/", views.JobDetail.as_view(), name="job_edit"),
    path(f"{admin_url}healthcheck/", views.Healthcheck.as_view(), name="healthcheck",),
    path(admin_url, admin.site.urls),
]
