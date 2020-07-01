# flake8: noqa

from decouple import config

from .base import *

DEBUG = False

ADMINS = []
_admin_names = config("DJANGO_ADMIN_NAMES", default="")
_admin_emails = config("DJANGO_ADMIN_EMAILS", "")
if len(_admin_names) > 0 and len(_admin_emails) > 0:
    ADMINS = list(zip(_admin_names.split("|"), _admin_emails.split("|")))
    MANAGERS = ADMINS
else:
    raise ValueError("Invalid DJANGO_ADMIN_NAMES or DJANGO_ADMIN_EMAILS")

SECRET_KEY = config("DJANGO_SECRET_KEY")
ALLOWED_HOSTS = config("DJANGO_ALLOWED_HOSTS", default="").split("|")
if len(ALLOWED_HOSTS) < 1:
    raise ValueError("DJANGO_ALLOWED_HOSTS is required")

DEFAULT_FROM_EMAIL = config("DJANGO_DEFAULT_FROM_EMAIL")
if os.environ.get("DJANGO_EMAIL_BACKEND") == "SMTP":
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    EMAIL_HOST = config("DJANGO_EMAIL_HOST")
    EMAIL_HOST_USER = config("DJANGO_EMAIL_USER")
    EMAIL_HOST_PASSWORD = config("DJANGO_EMAIL_PASSWORD")
    EMAIL_PORT = config("DJANGO_EMAIL_PORT", cast=int)
    EMAIL_USE_SSL = config("DJANGO_EMAIL_USE_SSL", cast=bool)
elif os.environ.get("DJANGO_EMAIL_BACKEND") == "MAILGUN":
    INSTALLED_APPS += ("anymail",)
    EMAIL_BACKEND = "anymail.backends.mailgun.EmailBackend"
    ANYMAIL = dict(
        MAILGUN_API_KEY=os.environ["MAILGUN_ACCESS_KEY"],
        MAILGUN_SENDER_DOMAIN=os.environ["MAILGUN_SERVER_NAME"],
    )
else:
    raise ValueError("Unknown email backend")

# DB settings
DATABASES["default"] = dict(
    ENGINE="django.db.backends.postgresql",
    NAME=config("DJANGO_DB_NAME"),
    USER=config("DJANGO_DB_USER"),
    PASSWORD=config("DJANGO_DB_PW"),
    HOST=config("DJANGO_DB_HOST"),
    CONN_MAX_AGE=300,
)

# cache settings
CACHES["default"] = dict(
    BACKEND="django_redis.cache.RedisCache",
    LOCATION=config("DJANGO_CACHE_LOCATION"),
    OPTIONS={"CLIENT_CLASS": "django_redis.client.DefaultClient"},
    TIMEOUT=60 * 10,  # 10 minutes (in seconds)
)

BROKER_URL = config("DJANGO_BROKER_URL")
CELERY_RESULT_BACKEND = config("DJANGO_CELERY_RESULT_BACKEND")
