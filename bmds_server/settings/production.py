import os
from bmds_server.settings.base import *  # noqa

DEBUG = False

SECRET_KEY = os.environ['DJANGO_SECRET_KEY']
ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS', '').split(';')
if len(ALLOWED_HOSTS) < 1:
    raise ValueError('DJANGO_ALLOWED_HOSTS is required')

EMAIL_HOST = os.environ['DJANGO_EMAIL_HOST']
EMAIL_HOST_USER = os.environ['DJANGO_EMAIL_USER']
EMAIL_HOST_PASSWORD = os.environ['DJANGO_EMAIL_PASSWORD']
EMAIL_PORT = int(os.environ['DJANGO_EMAIL_PORT'])
EMAIL_USE_SSL = bool(os.environ['DJANGO_EMAIL_USE_SSL'] == 'True')
DEFAULT_FROM_EMAIL = os.environ['DJANGO_DEFAULT_FROM_EMAIL']

PUBLIC_ROOT = os.environ['DJANGO_PUBLIC_PATH']
STATIC_ROOT = os.path.join(PUBLIC_ROOT, 'static')
MEDIA_ROOT = os.path.join(PUBLIC_ROOT, 'media')

LOGGING['handlers']['file'].update(
    level="INFO",
    filename=os.environ['DJANGO_LOG_FULLPATH']
)
