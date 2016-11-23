from celery.utils.log import get_task_logger
from celery.decorators import task
from django.apps import apps
import traceback

logger = get_task_logger(__name__)


@task()
def execute(id_):
    job = apps.get_model('jobrunner', 'Job').objects.get(id=id_)
    logger.info('starting execution: {}'.format(job))
    try:
        job.execute()
    except Exception:
        err = traceback.format_exc()
        job.handle_execution_error(err)
