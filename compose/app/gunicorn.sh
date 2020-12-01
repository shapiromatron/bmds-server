#!/bin/bash

/usr/local/bin/gunicorn bmds_server.main.wsgi \
    --bind 0.0.0.0:5000 \
    --chdir=/app \
    --timeout 300 \
    --workers $(nproc) \
    --log-level info \
    --access-logfile - \
    --log-file - \
    --max-requests 750 \
    --max-requests-jitter 250
