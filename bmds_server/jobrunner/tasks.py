from datetime import timedelta

from bmds.drunner import BatchDfileRunner
from celery.decorators import periodic_task, task
from celery.utils.log import get_task_logger
from django.apps import apps
from django.utils.timezone import now

logger = get_task_logger(__name__)


@task()
def try_execute(id_):
    job = apps.get_model("jobrunner", "Job").objects.get(id=id_)
    logger.info("starting execution: {}".format(job))
    job.try_execute()
    logger.info("finished execution: {}".format(job))


@task()
def execute_dfile(payload):
    logger.info("starting execute_dfile")
    runner = BatchDfileRunner(payload)
    output = runner.execute()
    logger.info("finished execute_dfile")
    return output


@periodic_task(run_every=timedelta(hours=1))
def delete_old_jobs():
    logger.info("Deleting old jobs at {}.".format(now().strftime("%c")))
    apps.get_model("jobrunner", "Job").delete_old_jobs()
