"""Celerybeat windows service task installer.

To install service, call (from virtualenv):
    python run_celerybeat_winservice.py install

To un-install service:
    python run_celerybeat_winservice.py remove

To start service (batch):
    sc start bmds_celerybeat

To stop service (batch):
    sc stop bmds_celerybeat

"""
import logging
import os
import win32serviceutil
from windows_services.service import BaseService


logging.basicConfig(
    filename=os.path.join(BaseService.LOGDIR, 'celerybeat_service.log'),
    level=logging.DEBUG,
    format='[%(asctime)-15s: %(levelname)-7.7s] %(message)s'
)


class CeleryBeatService(BaseService):

    _svc_name_ = 'bmds_celerybeat'
    _svc_display_name_ = 'BMDS Celerybeat Worker Service'
    _svc_cmd = 'celerybeat'


if __name__ == '__main__':
    win32serviceutil.HandleCommandLine(CeleryBeatService)
