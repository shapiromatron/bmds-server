from celery.utils.log import get_task_logger
from celery.decorators import task, periodic_task
from datetime import timedelta
from django.apps import apps
from django.utils.timezone import now
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


@periodic_task(run_every=timedelta(hours=1))
def delete_old_jobs():
    logger.info('Deleting old jobs at {}.'.format(now().strftime('%c')))
    apps.get_model('jobrunner', 'Job').delete_old_jobs()
