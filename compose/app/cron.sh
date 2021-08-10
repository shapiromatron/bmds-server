#!/bin/bash

set -xe

/usr/local/bin/celery \
    --app=bmds_server.main.celery \
    beat \
    --loglevel=INFO
