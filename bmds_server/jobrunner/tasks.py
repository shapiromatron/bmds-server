from celery import task
from celery.utils.log import get_task_logger
from django.apps import apps
from django.contrib.auth import get_user_model
from django.utils import timezone

logger = get_task_logger(__name__)


@task
def diagnostic_celery_task(id_: str):
    User = get_user_model()
    user = User.objects.get(id=id_)
    logger.info(f"Diagnostic celery task triggered by: {user}")
    return dict(success=True, when=str(timezone.now()), user=user.email)


@task()
def try_execute(id_: str):
    job = apps.get_model("jobrunner", "Job").objects.get(id=id_)
    logger.info(f"starting execution: {job}")
    job.try_execute()
    logger.info(f"finished execution: {job}")


@task()
def delete_old_jobs():
    logger.info("Deleting old jobs")
    apps.get_model("jobrunner", "Job").delete_old_jobs()
