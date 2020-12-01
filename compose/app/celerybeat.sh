#!/bin/bash

/usr/local/bin/celery beat \
    --app bmds_server.main.celery \
    --loglevel INFO
