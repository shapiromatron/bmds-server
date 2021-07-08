from celery import shared_task
from celery.utils.log import get_task_logger

from .worker_health import worker_healthcheck

logger = get_task_logger(__name__)


@shared_task
def worker_healthcheck_push():
    worker_healthcheck.push()
