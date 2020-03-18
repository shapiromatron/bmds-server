from django.conf.urls import include
from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter

from . import api, views

router = DefaultRouter()
router.register("job", api.JobViewset, base_name="job")
router.register("dfile", api.DfileExecutorViewset, base_name="dfile")

urlpatterns = [
    path("api/", include((router.urls, "jobrunner"), namespace="api")),
    path("", views.Home.as_view(), name="home"),
    path("job/q/", views.JobQuery.as_view(), name="job_query"),
    path("job/<uuid:pk>/", views.JobDetail.as_view(), name="job"),
    path("batcave/", admin.site.urls),
]
