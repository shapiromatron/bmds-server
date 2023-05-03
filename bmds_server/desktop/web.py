import logging
import os
import sys
import threading
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path
from wsgiref.simple_server import make_server

from whitenoise import WhiteNoise

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parents[2]
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bmds_server.main.settings.dev")


class MyServer(threading.Thread):
    PORT = 8888

    def run(self):
        from django.core.wsgi import get_wsgi_application

        app = get_wsgi_application()
        app = WhiteNoise(app, root=(BASE_DIR / "public").resolve())
        port = int(self._kwargs.get("PORT", 8888))
        self.server = make_server("", port, app)
        logger.info(f"Starting application http://localhost:{port}")
        with redirect_stderr(sys.stderr), redirect_stdout(sys.stdout):
            self.server.serve_forever()

    def stop(self):
        if hasattr(self, "server"):
            self.server.shutdown()
            self.server.server_close()
