from django.apps import AppConfig


class Config(AppConfig):
    name = "bmds_server.jobrunner"

    def ready(self):
        from . import signals  # noqa
