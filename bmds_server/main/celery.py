import os
from datetime import timedelta

from celery import Celery

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    os.environ.get("DJANGO_SETTINGS_MODULE", "bmds_server.main.settings.dev"),
)

from django.conf import settings  # noqa  # isort:skip

app = Celery("bmds_server")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()


app.conf.beat_schedule = {
    "worker-healthcheck": {
        "task": "bmds_server.common.tasks.worker_healthcheck_push",
        "schedule": timedelta(minutes=5),
        "options": {"expires": timedelta(minutes=5).total_seconds()},
    },
    "ten-minutes-delete-old-analyses": {
        "task": "bmds_server.analysis.tasks.delete_old_analyses",
        "schedule": timedelta(minutes=60),
        "options": {"expires": timedelta(minutes=60).total_seconds()},
    },
}
