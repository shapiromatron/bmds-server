#!/bin/bash

set -xe

/usr/local/bin/celery \
    --app=bmds_server.main.celery \
    worker \
    --loglevel=INFO
