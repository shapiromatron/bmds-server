#!/bin/bash

set -xe

manage.py clear_cache
manage.py migrate --noinput
manage.py collectstatic --noinput

if [[ $FLUSH_TEST_DB == "True" ]]; then
    echo "clearing database..."
    manage.py flush --noinput
else
    echo "not clearing database..."
fi

if [[ $LOAD_TEST_DB == "True" ]]; then
    echo "loading database..."
    manage.py load_test_db --ifempty
else
    echo "not loading database..."
fi

# succcessful exit for healthchecks
exit 0
