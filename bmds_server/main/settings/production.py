# flake8: noqa

import os

from ..constants import SkinStyle
from .base import *

DEBUG = False

# deployment environment
SERVER_ROLE = os.environ["DJANGO_SERVER_ROLE"]
SERVER_BANNER_COLOR = "#EE8416"
SKIN = SkinStyle(int(os.environ["DJANGO_SKIN"]))

ADMINS = []
_admin_names = os.environ["DJANGO_ADMIN_NAMES"]
_admin_emails = os.environ["DJANGO_ADMIN_EMAILS"]
if _admin_names and _admin_emails:
    ADMINS = list(zip(_admin_names.split("|"), _admin_emails.split("|")))
    MANAGERS = ADMINS
else:
    raise ValueError("Invalid DJANGO_ADMIN_NAMES or DJANGO_ADMIN_EMAILS")

ALLOWED_HOSTS = os.environ["DJANGO_ALLOWED_HOSTS"].split("|")
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
ADMIN_URL_PREFIX = os.environ["ADMIN_URL_PREFIX"]

# Email settings
DEFAULT_FROM_EMAIL = os.environ["DJANGO_DEFAULT_FROM_EMAIL"]
DJANGO_EMAIL_BACKEND = os.environ["DJANGO_EMAIL_BACKEND"]
if DJANGO_EMAIL_BACKEND == "SMTP":
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    EMAIL_HOST = os.environ["DJANGO_EMAIL_HOST"]
    EMAIL_HOST_USER = os.environ["DJANGO_EMAIL_USER"]
    EMAIL_HOST_PASSWORD = os.environ["DJANGO_EMAIL_PASSWORD"]
    EMAIL_PORT = int(os.environ["DJANGO_EMAIL_PORT"])
    EMAIL_USE_SSL = os.environ["DJANGO_EMAIL_USE_SSL"].lower() == "true"
elif DJANGO_EMAIL_BACKEND == "MAILGUN":
    INSTALLED_APPS += ("anymail",)
    EMAIL_BACKEND = "anymail.backends.mailgun.EmailBackend"
    ANYMAIL = dict(
        MAILGUN_API_KEY=os.environ["MAILGUN_ACCESS_KEY"],
        MAILGUN_SENDER_DOMAIN=os.environ["MAILGUN_SERVER_NAME"],
    )
else:
    raise ValueError(f"Unknown email backend: {DJANGO_EMAIL_BACKEND}")

# Database settings
DATABASES["default"] = dict(
    ENGINE="django.db.backends.postgresql",
    NAME=os.environ["DJANGO_DB_NAME"],
    USER=os.environ["DJANGO_DB_USER"],
    PASSWORD=os.environ["DJANGO_DB_PW"],
    HOST=os.environ["DJANGO_DB_HOST"],
    CONN_MAX_AGE=300,
)

# Cache settings
CACHES["default"] = dict(
    BACKEND="django_redis.cache.RedisCache",
    LOCATION=os.environ["DJANGO_CACHE_LOCATION"],
    OPTIONS={"CLIENT_CLASS": "django_redis.client.DefaultClient"},
    TIMEOUT=60 * 10,  # 10 minutes (in seconds)
)

# Celery settings
CELERY_BROKER_URL = os.environ["DJANGO_CELERY_BROKER_URL"]
CELERY_RESULT_BACKEND = os.environ["DJANGO_CELERY_RESULT_BACKEND"]
