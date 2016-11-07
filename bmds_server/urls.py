from django.conf.urls import url
from django.contrib import admin


from jobrunner import views


urlpatterns = [

    url(r'^$',
        views.Home.as_view(),
        name='home'),
    url(r'^job/(?P<pk>[\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12})/$',
        views.JobDetail.as_view(),
        name='job'),

    url(r'^admin/', admin.site.urls),
]
