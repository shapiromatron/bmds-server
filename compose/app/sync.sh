#!/bin/bash

set -e

echo "clearing cache..."
manage.py clear_cache

echo "migrating db..."
manage.py migrate --noinput

echo "collecting static files..."
manage.py collectstatic --noinput

echo "sync complete!"
