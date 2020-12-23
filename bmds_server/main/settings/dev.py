# flake8: noqa
from .base import *

INSTALLED_APPS += ("django_extensions",)
INTERNAL_IPS = ("127.0.0.1",)

DEBUG = True

SERVER_ROLE = "development environment"
SERVER_BANNER_COLOR = "#318d50"

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

LOGGING["loggers"][""]["handlers"] = ["console"]
LOGGING["loggers"][""]["level"] = "INFO"

CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True

# disable throttling
REST_FRAMEWORK = {"DEFAULT_THROTTLE_CLASSES": (), "DEFAULT_THROTTLE_RATES": {}}

try:
    # load local settings from `local.py` if they exist
    from .local import *
except ModuleNotFoundError:
    pass
