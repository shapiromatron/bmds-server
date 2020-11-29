#!/bin/bash

manage.py clear_cache
manage.py migrate --noinput
manage.py collectstatic --noinput
