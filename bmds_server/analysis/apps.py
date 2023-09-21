from django.apps import AppConfig


class Config(AppConfig):
    name = "bmds_server.analysis"

    def ready(self):
        from .signals import init_command  # noqa: F401
