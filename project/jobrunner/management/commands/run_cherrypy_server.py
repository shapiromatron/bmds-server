# Adapted from: https://lincolnloop.com/blog/2008/mar/25/serving-django-cherrypy/.
# https://gist.github.com/alfredodeza/5911893

import cherrypy
from cheroot import wsgi
import os
from django.core.management.base import BaseCommand
from django.conf import settings

from main.wsgi import application


HELP_TEXT = """Serve application + static files using CherryPy WSGI server."""


class Root:
    pass


def create_static_app():
    path = os.path.join(settings.BASE_DIR, 'public')
    cherrypy.config.update({'environment': 'production'})
    configuration = {'/': {
        'tools.staticdir.on': True,
        'tools.staticdir.dir': path}
    }
    return cherrypy.tree.mount(Root(), '/', config=configuration)


class Command(BaseCommand):

    help = HELP_TEXT

    def handle(self, *args, **options):

        # Added to environment by IIS or secrets.json
        port = int(os.environ.get('HTTP_PLATFORM_PORT', 8000))

        addr = ('0.0.0.0', port)
        path_map = {
            '/': application,
            '/static': create_static_app(),
        }
        dispatcher = wsgi.PathInfoDispatcher(path_map)
        server = wsgi.Server(addr, dispatcher)
        server.safe_start()
