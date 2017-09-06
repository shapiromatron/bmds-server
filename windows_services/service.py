import logging
import os
import subprocess
import shlex
import sys
import win32service
import win32serviceutil
import win32api
import win32event

from .commands import set_environment


class BaseService(win32serviceutil.ServiceFramework):

    BASEDIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    BINDIR = os.path.abspath(os.path.join(BASEDIR, '..', 'venv', 'Scripts'))
    LOGDIR = os.path.abspath(os.path.join(BASEDIR, 'logs'))

    _svc_name_ = '<ADD>'
    _svc_display_name_ = '<ADD>'

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
        exe = os.path.join(self.BINDIR, 'python.exe')
        py = os.path.join(self.BASEDIR, 'windows_services', 'commands.py')
        return '"{0}" {1} {2}'.format(exe, py, self._svc_cmd)

    def SvcDoRun(self):
        set_environment()
        logging.info('Starting {name} service ...'.format(name=self._svc_name_))
        os.chdir(self.BASEDIR)
        logging.info('cwd: ' + os.getcwd())
        self.ReportServiceStatus(win32service.SERVICE_RUNNING)
        command = self.get_command()
        logging.info('Command: ' + command)
        args = shlex.split(command)
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
