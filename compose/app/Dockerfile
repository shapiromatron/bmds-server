FROM python:3.6-slim

RUN groupadd -g 555 -r app && \
    useradd -u 555 -r -g app app

COPY ./compose/app/entrypoint.sh /app/bin/entrypoint.sh
COPY ./compose/app/gunicorn.sh /app/bin/gunicorn.sh
COPY ./compose/app/celery.sh /app/bin/celery.sh
COPY ./compose/app/celerybeat.sh /app/bin/celerybeat.sh
COPY ./compose/app/supervisord.conf /app/bin/supervisord.conf

# 1) install start-scripts
# 2) install fonts
# 3) create logs path
RUN mkdir -p /app/logs && \
    mkdir -p /app/public/media

COPY ./requirements /requirements
COPY ./vendor /vendor

RUN pip install -U pip && \
    pip install -r /requirements/production.txt --no-cache-dir && \
    rm -rf /requirements && \
    rm -rf /vendor

WORKDIR /app

COPY ./dist/bmds_server.tar.gz /app/bmds_server.tar.gz
RUN tar -xf /app/bmds_server.tar.gz -C /app && \
    rm /app/bmds_server.tar.gz && \
    pip install -e . && \
    chown -R app:app /app

USER app

ENTRYPOINT ["/app/bin/entrypoint.sh"]
