#!/bin/bash

set -xe

manage.py clear_cache
manage.py migrate --noinput
manage.py collectstatic --noinput

if [[ $LOAD_TEST_DB == "True" ]]; then
    echo "loading test database..."
    manage.py load_test_db
fi
