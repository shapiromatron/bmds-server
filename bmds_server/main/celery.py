import os

from celery import Celery
from decouple import config

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    config("DJANGO_SETTINGS_MODULE", default="bmds_server.main.settings.dev"),
)

from django.conf import settings  # noqa  # isort:skip

app = Celery("bmds_server")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()


app.conf.beat_schedule = {
    "ten-minutes-delete-old-jobs": {
        "task": "bmds_server.jobrunner.tasks.delete_old_jobs",
        "schedule": 60 * 10,  # every 10 minutes
    },
}
