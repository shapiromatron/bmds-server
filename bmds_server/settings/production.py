import os
from bmds_server.settings.base import *  # noqa

DEBUG = False

ADMINS = []
_admin_names = os.getenv('DJANGO_ADMIN_NAMES', "")
_admin_emails = os.getenv('DJANGO_ADMIN_EMAILS', "")
if (len(_admin_names) > 0 and len(_admin_emails) > 0):
    ADMINS = list(zip(_admin_names.split("|"), _admin_emails.split("|")))
    MANAGERS = ADMINS
else:
    raise ValueError('Invalid DJANGO_ADMIN_NAMES or DJANGO_ADMIN_EMAILS')

SECRET_KEY = os.environ['DJANGO_SECRET_KEY']
ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS', '').split('|')
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
