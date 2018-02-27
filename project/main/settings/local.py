import os
from .dev import *  # noqa

CELERY_ALWAYS_EAGER = True
CELERY_EAGER_PROPAGATES_EXCEPTIONS = True

BROKER_URL = 'redis://localhost:6379'
CELERY_RESULT_BACKEND = 'db+sqlite:///celery.sqlite3'

os.environ.setdefault('BMDS_REQUEST_URL', 'http://ehsbmdvwd03/api/dfile/')
os.environ.setdefault('BMDS_TOKEN', '9a634400957e2c0849250b3c9cbcf44896354d0d')
