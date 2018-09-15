from django.conf.urls import include, url
from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter

from jobrunner import views, api


router = DefaultRouter()
router.register("job", api.JobViewset, base_name="job")
router.register("dfile", api.DfileExecutorViewset, base_name="dfile")

urlpatterns = [
    url(r"^api/", include(router.urls, namespace="api")),
    url(r"^$", views.Home.as_view(), name="home"),
    url(r"^job/q/$", views.JobQuery.as_view(), name="job_query"),
    url(
        r"^job/(?P<pk>[\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12})/$",
        views.JobDetail.as_view(),
        name="job",
    ),
    url(r"^batcave/", admin.site.urls),
]
