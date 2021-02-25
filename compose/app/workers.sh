#!/bin/bash

set -xe

/usr/local/bin/celery worker \
    --app=bmds_server.main.celery \
    --loglevel=INFO
