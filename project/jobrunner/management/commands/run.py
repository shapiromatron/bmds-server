from enum import Enum
import logging
from os.path import join

from cheroot import wsgi
import cherrypy
from django.conf import settings
from django.core.management.base import BaseCommand


class ApplicationChoices(Enum):
    WEBAPP = "webapp"
    CELERY_WORKER = "celery_worker"
    CELERY_BEAT = "celery_beat"


class Command(BaseCommand):

    help = "Run selected application."

    def add_arguments(self, parser):
        parser.add_argument(
            "application", type=ApplicationChoices, choices=list(ApplicationChoices)
        )

    def handle(self, application, **options):
        self.logger = logging.getLogger(__name__)
        if application == ApplicationChoices.WEBAPP:
            self.run_webapp()
        elif application == ApplicationChoices.CELERY_WORKER:
            self.run_celery()
        elif application == ApplicationChoices.CELERY_BEAT:
            self.run_celerybeat()

    def run_webapp(self):
        from main.wsgi import application

        class Root:
            pass

        cherrypy.config.update({"environment": "production"})
        static_app = cherrypy.tree.mount(
            Root(),
            "/",
            config={
                "/": {
                    "tools.staticdir.on": True,
                    "tools.staticdir.dir": join(settings.ROOT_DIR, "public"),
                }
            },
        )

        addr = ("0.0.0.0", settings.HTTP_PLATFORM_PORT)
        dispatcher = wsgi.PathInfoDispatcher({"/": application, "/static": static_app})
        server = wsgi.Server(addr, dispatcher)
        self.logger.info("Starting webapp: {}".format(server._bind_addr))
        server.safe_start()

    def run_celery(self):
        from main.celery import app
        from celery.bin import worker

        worker.worker(app=app).run(
            loglevel="INFO", logfile=join(settings.ROOT_DIR, "logs", "celery.log"), events=True
        )

    def run_celerybeat(self):
        from main.celery import app
        from celery.bin import beat

        beat.beat(app=app).run(
            loglevel="INFO", logfile=join(settings.ROOT_DIR, "logs", "celerybeat.log")
        )
