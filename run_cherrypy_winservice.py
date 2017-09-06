"""Cherrypy windows service task installer.

To install service, call (from virtualenv):
    python run_cherrypy_winservice.py install

To un-install service:
    python run_cherrypy_winservice.py install

To start service (batch):
    sc start bmds_server

To stop service (batch):
    sc stop bmds_server

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


class WebserverService(BaseService):

    _svc_name_ = 'bmds_server'
    _svc_display_name_ = 'BMDS Webserver'
    _svc_cmd = 'server'


if __name__ == '__main__':
    win32serviceutil.HandleCommandLine(WebserverService)
