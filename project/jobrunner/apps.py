from django.apps import AppConfig


class Config(AppConfig):
    name = 'jobrunner'

    def ready(self):
        from . import signals  # noqa
