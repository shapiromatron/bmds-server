import os
import shlex
import subprocess
import sys
from pathlib import Path

import servicemanager
import win32api
import win32event
import win32service
import win32serviceutil

# TODO: fix hard coding :(
PROJECT_PATH = "C:\\apps\\bmds-server\\project"
PYTHON_EXE = "C:\\apps\\venv\\Scripts\\python.exe"
assert os.path.exists(PROJECT_PATH)
assert os.path.exists(PYTHON_EXE)


class BaseService(win32serviceutil.ServiceFramework):

    # Class ABC attributes
    _svc_name_ = "<ADD>"
    _svc_display_name_ = "<ADD>"
    _svc_cmd_ = "<ADD>"

    PROJECT_PATH = str(Path(PROJECT_PATH).resolve())
    ROOT_DIR = str(Path(PROJECT_PATH) / "..")
    LOG_DIR = str(Path(ROOT_DIR) / "logs")
    PYTHON_EXE = str(Path(PYTHON_EXE).resolve())
    TIMEOUT = 3000  # milliseconds

    def __init__(self, args):
        win32serviceutil.ServiceFramework.__init__(self, args)
        self.stop_event = win32event.CreateEvent(None, 0, 0, None)

    def SvcStop(self):
        servicemanager.LogInfoMsg(f"Stopping {self._svc_name_}")
        self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
        win32event.SetEvent(self.stop_event)

    def SvcDoRun(self):
        servicemanager.LogInfoMsg(f"The {self._svc_name_} service has started.")
        command = f'"{self.PYTHON_EXE}" {self._svc_cmd_}'
        args = shlex.split(command)
        proc = subprocess.Popen(args, cwd=self.PROJECT_PATH)
        self.ReportServiceStatus(win32service.SERVICE_RUNNING)
        while True:
            rc = win32event.WaitForSingleObject(self.stop_event, self.TIMEOUT)
            if rc == win32event.WAIT_OBJECT_0:
                handle = win32api.OpenProcess(1, False, proc.pid)
                win32api.TerminateProcess(handle, -1)
                win32api.CloseHandle(handle)
                self.ReportServiceStatus(win32service.SERVICE_STOPPED)
                break


class WebAppService(BaseService):
    _svc_name_ = "bmds_webapp"
    _svc_display_name_ = "BMDS Webapp"
    _svc_cmd_ = "manage.py run webapp"


class CeleryService(BaseService):
    _svc_name_ = "bmds_celery_worker"
    _svc_display_name_ = "BMDS Celery Worker"
    _svc_cmd_ = "manage.py run celery_worker"


class CeleryBeatService(BaseService):
    _svc_name_ = "bmds_celery_beat"
    _svc_display_name_ = "BMDS Celery Beat"
    _svc_cmd_ = "manage.py run celery_beat"


if __name__ == "__main__":

    invalid_command = "Command missing: install|remove|update|start|stop|restart|status"
    if len(sys.argv) != 2:
        raise ValueError(invalid_command)

    cmd = sys.argv[1]

    if cmd in ["install", "remove", "update", "start", "stop", "restart"]:
        win32serviceutil.HandleCommandLine(WebAppService)
        win32serviceutil.HandleCommandLine(CeleryService)
        win32serviceutil.HandleCommandLine(CeleryBeatService)
    elif cmd == "status":
        os.system("sc query bmds_webapp")
        os.system("sc query bmds_celery_worker")
        os.system("sc query bmds_celery_beat")
    else:
        raise ValueError(invalid_command)
