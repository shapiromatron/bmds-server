from os.path import join
from decouple import config
from .base import *  # noqa


DEBUG = False

ADMINS = []
_admin_names = config('DJANGO_ADMIN_NAMES', default='')
_admin_emails = config('DJANGO_ADMIN_EMAILS', '')
if (len(_admin_names) > 0 and len(_admin_emails) > 0):
    ADMINS = list(zip(_admin_names.split("|"), _admin_emails.split("|")))
    MANAGERS = ADMINS
else:
    raise ValueError('Invalid DJANGO_ADMIN_NAMES or DJANGO_ADMIN_EMAILS')

SECRET_KEY = config('DJANGO_SECRET_KEY')
ALLOWED_HOSTS = config('DJANGO_ALLOWED_HOSTS', default='').split('|')
if len(ALLOWED_HOSTS) < 1:
    raise ValueError('DJANGO_ALLOWED_HOSTS is required')

EMAIL_HOST = config('DJANGO_EMAIL_HOST')
EMAIL_HOST_USER = config('DJANGO_EMAIL_USER')
EMAIL_HOST_PASSWORD = config('DJANGO_EMAIL_PASSWORD')
EMAIL_PORT = config('DJANGO_EMAIL_PORT', cast=int)
EMAIL_USE_SSL = config('DJANGO_EMAIL_USE_SSL', cast=bool)
DEFAULT_FROM_EMAIL = config('DJANGO_DEFAULT_FROM_EMAIL')

PUBLIC_ROOT = join(BASE_DIR, 'public')
STATIC_ROOT = join(PUBLIC_ROOT, 'static')
MEDIA_ROOT = join(PUBLIC_ROOT, 'media')

LOGGING['handlers']['file'].update(
    level="INFO",
    filename=join(BASE_DIR, 'logs', 'django.log')
)

BROKER_URL = config('CELERY_BROKER_URL')
CELERY_RESULT_BACKEND = config('CELERY_RESULT_BACKEND')
