from celery import task
from celery.utils.log import get_task_logger
from django.apps import apps

from .cache import DocxReportCache, ExcelReportCache

logger = get_task_logger(__name__)


@task()
def try_execute(id_: str):
    analysis = apps.get_model("analysis", "Analysis").objects.get(id=id_)
    logger.info(f"starting execution: {analysis}")
    analysis.try_execute()
    logger.info(f"finished execution: {analysis}")


@task()
def delete_old_analyses():
    logger.info("Deleting old analyses")
    apps.get_model("analysis", "Analysis").delete_old_analyses()


@task()
def generate_report(id_: str):
    logger.info(f"starting report generation: {id_}")
    analysis = apps.get_model("analysis", "Analysis").objects.get(id=id_)
    DocxReportCache(analysis).create_content()
    logger.info(f"finishing report generation: {id_}")


@task()
def generate_excel(id_: str):
    logger.info(f"starting excel generation: {id_}")
    analysis = apps.get_model("analysis", "Analysis").objects.get(id=id_)
    ExcelReportCache(analysis).create_content()
    logger.info(f"finishing excel generation: {id_}")
