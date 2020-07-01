#!/bin/sh

manage.py clear_cache
manage.py migrate --noinput
manage.py collectstatic --noinput

LOGFILE="$LOGS_PATH/gunicorn.log"

# serve w/ gunicorn
/usr/local/bin/gunicorn bmds_server.main.wsgi \
    --bind 0.0.0.0:5000 \
    --chdir=/app \
    --timeout 300 \
    --workers 3 \
    --log-level info \
    --log-file $LOGFILE \
    --max-requests 750 \
    --max-requests-jitter 250
