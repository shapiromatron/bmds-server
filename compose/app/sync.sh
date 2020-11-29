#!/bin/bash
# quit on failure
set -e

manage.py clear_cache
manage.py migrate --noinput
manage.py collectstatic --noinput
