from django.conf.urls import include
from django.conf import settings
from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter

from . import api, views

router = DefaultRouter()
router.register("job", api.JobViewset, basename="job")
router.register("dfile", api.DfileExecutorViewset, basename="dfile")

urlpatterns = [
    path("api/v1/", include((router.urls, "jobrunner"), namespace="api")),
    path("", views.Home.as_view(), name="home"),
    path("job/q/", views.JobQuery.as_view(), name="job_query"),
    path("job/<uuid:pk>/", views.JobDetail.as_view(), name="job"),
    path(f"{settings.ADMIN_URL_PREFIX}/admin/", admin.site.urls),
]
