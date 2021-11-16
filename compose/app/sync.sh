#!/bin/bash

set -xe

manage.py clear_cache
manage.py clearsessions
manage.py migrate --noinput
manage.py collectstatic --noinput

if [[ $LOAD_TEST_DB == "2" ]]; then
    echo "loading fixture database..."
    manage.py load_test_db
elif [[ $LOAD_TEST_DB == "1" ]]; then
    echo "loading fixture database (if empty)..."
    manage.py load_test_db --ifempty
else
    echo "not modifying database..."
fi

# successful exit for healthchecks
exit 0
