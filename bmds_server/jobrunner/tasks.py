from celery import task
from celery.utils.log import get_task_logger
from django.apps import apps

from .cache import DocxReportCache, ExcelReportCache

logger = get_task_logger(__name__)


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


@task()
def generate_report(id_: str):
    logger.info(f"starting report generation: {id_}")
    job = apps.get_model("jobrunner", "Job").objects.get(id=id_)
    DocxReportCache(job).create_content()
    logger.info(f"finishing report generation: {id_}")


@task()
def generate_excel(id_: str):
    logger.info(f"starting excel generation: {id_}")
    job = apps.get_model("jobrunner", "Job").objects.get(id=id_)
    ExcelReportCache(job).create_content()
    logger.info(f"finishing excel generation: {id_}")
