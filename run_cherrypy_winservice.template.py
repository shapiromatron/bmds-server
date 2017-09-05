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
import win32service
import win32serviceutil
import win32api
import win32event
import subprocess
import sys
import os
import shlex
import logging


BASEDIR = os.path.abspath(os.path.dirname(os.path.realpath(__file__)))
LOGDIR = os.path.join(BASEDIR, 'logs')
PYTHONSCRIPTPATH = os.path.join(BASEDIR, 'venv', 'Scripts')
PROJECTDIR = 'bmds_server'
SERVICE_NAME = 'bmds_server'
SERVICE_DISPLAY_NAME = 'BMDS Webserver'

logging.basicConfig(
    filename=os.path.join(LOGDIR, 'server_service.log'),
    level=logging.DEBUG,
    format='[%(asctime)-15s: %(levelname)-7.7s] %(message)s'
)


def set_env():
    pass  # ENVPLACEHOLDER


class Service(win32serviceutil.ServiceFramework):

    _svc_name_ = SERVICE_NAME
    _svc_display_name_ = SERVICE_DISPLAY_NAME

    def __init__(self, args):
        win32serviceutil.ServiceFramework.__init__(self, args)
        self.hWaitStop = win32event.CreateEvent(None, 0, 0, None)

    def SvcStop(self):
        logging.info('Stopping {name} service ...'.format(name=self._svc_name_))
        self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
        win32event.SetEvent(self.hWaitStop)
        self.ReportServiceStatus(win32service.SERVICE_STOPPED)
        sys.exit()

    def get_command(self):
        exe = os.path.join(PYTHONSCRIPTPATH, 'python.exe')
        args = 'manage.py run_cherrypy_server'
        return '"{0}" {1}'.format(exe, args)

    def SvcDoRun(self):
        logging.info('Starting {name} service ...'.format(name=self._svc_name_))
        os.chdir(BASEDIR)
        logging.info('cwd: ' + os.getcwd())
        self.ReportServiceStatus(win32service.SERVICE_RUNNING)
        command = self.get_command()
        logging.info('Command: ' + command)
        args = shlex.split(command)
        set_env()
        proc = subprocess.Popen(args)
        logging.info('PID: {0}'.format(proc.pid))
        self.timeout = 3000
        while True:
            rc = win32event.WaitForSingleObject(self.hWaitStop, self.timeout)
            if rc == win32event.WAIT_OBJECT_0:
                terminate_code = 1
                handle = win32api.OpenProcess(terminate_code, False, proc.pid)
                win32api.TerminateProcess(handle, -1)
                win32api.CloseHandle(handle)
                break


if __name__ == '__main__':
    win32serviceutil.HandleCommandLine(Service)
