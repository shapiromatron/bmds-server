# https://lincolnloop.com/blog/2008/mar/25/serving-django-cherrypy/
# https://gist.github.com/alfredodeza/5911893

from cheroot import wsgi
import cherrypy
import json
import logging
import os
import sys


BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))


class Root():
    pass


def _set_environment():
    fn = os.path.join(BASE_DIR, 'secrets.json')

    with open(fn, 'r') as f:
        settings = json.load(f)

    for k, v in settings.items():
        os.environ[k] = v


def _run_server():
    from bmds_server.wsgi import application

    cherrypy.config.update({
        'environment': 'production'
    })
    static_app = cherrypy.tree.mount(Root(), '/', config={
        '/': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': os.path.join(BASE_DIR, 'public')}
    })

    logger = logging.getLogger(__name__)
    addr = ('0.0.0.0', int(os.environ['HTTP_PLATFORM_PORT']))
    path_map = {
        '/': application,
        '/static': static_app,
    }
    dispatcher = wsgi.PathInfoDispatcher(path_map)
    server = wsgi.Server(addr, dispatcher)
    logger.info(f'Starting {server._bind_addr}')
    server.safe_start()


def _run_celery():
    from bmds_server.celery import app
    from celery.bin import worker

    worker = worker.worker(app=app)
    options = {
        'loglevel': 'INFO',
        'logfile': os.path.join(BASE_DIR, 'logs\celery.log'),
        'events': True,
    }
    worker.run(**options)


def _run_celerybeat():
    from bmds_server.celery import app
    from celery.bin import beat

    beat = beat.beat(app=app)
    options = {
        'loglevel': 'INFO',
        'logfile': os.path.join(BASE_DIR, 'logs\celerybeat.log'),
    }
    beat.run(**options)


if __name__ == '__main__':

    _set_environment()
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bmds_server.settings.production')  # noqa
    os.environ.setdefault('HTTP_PLATFORM_PORT', '8000')

    runner = sys.argv[1]
    if runner == 'server':
        _run_server()
    elif runner == 'celery':
        _run_celery()
    elif runner == 'celerybeat':
        _run_celerybeat()
    else:
        raise ValueError('Unknown runtype')
