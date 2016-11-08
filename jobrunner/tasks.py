from celery.utils.log import get_task_logger
from celery.decorators import task

from django.apps import apps

import time


logger = get_task_logger(__name__)


@task()
def execute(id_):
    job = apps.get_model('jobrunner', 'Job').objects.get(id=id_)
    logger.info('starting task: {}'.format(job))
    time.sleep(10)
    job.mark_complete()
    logger.info('ending task: {}'.format(job))
