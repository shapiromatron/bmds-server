import os

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
        "schedule": 5 * 60,  # every 5 min
        "options": {"expires": 5 * 60},
    },
    "ten-minutes-delete-old-analyses": {
        "task": "bmds_server.analysis.tasks.delete_old_analyses",
        "schedule": 60 * 60,  # every hour
        "options": {"expires": 60 * 60},
    },
}
