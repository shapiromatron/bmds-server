# flake8: noqa

from .base import *

INSTALLED_APPS += ("django_extensions",)

DEBUG = True
SECRET_KEY = "4+7p%-l!_d_7lkn6y16jfpn-i=ul(9=$e@-+%s^-st3bcpx2^&"

CELERY_ALWAYS_EAGER = True
CELERY_EAGER_PROPAGATES_EXCEPTIONS = True

# disable throttling
REST_FRAMEWORK = {"DEFAULT_THROTTLE_CLASSES": (), "DEFAULT_THROTTLE_RATES": {}}
