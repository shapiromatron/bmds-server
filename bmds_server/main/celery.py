import os

from celery import Celery
from celery.schedules import crontab
from decouple import config

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    config("DJANGO_SETTINGS_MODULE", default="bmds_server.main.settings.dev"),
)

from django.conf import settings  # noqa  # isort:skip


app = Celery("bmds_server")
app.config_from_object("django.conf:settings")
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)


app.conf.beat_schedule = {
    "hourly-clear-old-results": {
        "task": "bmds_server.jobrunner.tasks.delete_old_jobs",
        "schedule": crontab(minute="*/15"),
    },
}
