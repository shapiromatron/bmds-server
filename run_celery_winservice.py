"""Celery windows service task installer.

To install service, call (from virtualenv):
    python run_celerybeat_winservice.py install

To un-install service:
    python run_celerybeat_winservice.py remove

To start service (batch):
    sc start bmds_celery

To stop service (batch):
    sc stop bmds_celery

"""
import logging
import os
import win32serviceutil
from windows_services.service import BaseService


logging.basicConfig(
    filename=os.path.join(BaseService.LOGDIR, 'celery_service.log'),
    level=logging.DEBUG,
    format='[%(asctime)-15s: %(levelname)-7.7s] %(message)s'
)


class CeleryService(BaseService):

    _svc_name_ = 'bmds_celery'
    _svc_display_name_ = 'BMDS Celery Worker Service'
    _svc_cmd = 'celery'


if __name__ == '__main__':
    win32serviceutil.HandleCommandLine(CeleryService)
