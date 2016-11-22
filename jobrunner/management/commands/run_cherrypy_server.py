# Adapted from: https://lincolnloop.com/blog/2008/mar/25/serving-django-cherrypy/.

import os
from django.core.management.base import BaseCommand

from bmds_server.wsgi import application
from cherrypy import wsgiserver


HELP_TEXT = """Serve application using CherryPy WSGI server."""


class Command(BaseCommand):

    help = HELP_TEXT

    def handle(self, *args, **options):

        # Added to environment by IIS
        port = int(os.environ.get('HTTP_PLATFORM_PORT', 8000))

        server = wsgiserver.CherryPyWSGIServer(
            ('0.0.0.0', port),
            application
        )

        server.start()
