FROM python:3.6-slim

ENV BMDS_SERVER_VERSION 0.8

RUN groupadd -g 555 -r app && \
    useradd -u 555 -r -g app app

# bmds shared object dependencies
RUN apt-get update -y && \
    apt-get install -y libgslcblas0 libgsl-dev

COPY ./compose/app/entrypoint.sh /app/bin/entrypoint.sh
COPY ./compose/app/sync.sh /app/bin/sync.sh
COPY ./compose/app/gunicorn.sh /app/bin/gunicorn.sh
COPY ./compose/app/celery.sh /app/bin/celery.sh
COPY ./compose/app/celerybeat.sh /app/bin/celerybeat.sh

# 1) install start-scripts
# 2) install fonts
# 3) create logs path
RUN mkdir -p /app/logs && \
    mkdir -p /app/public/media

COPY ./requirements /requirements
COPY ./vendor /vendor

RUN mv /vendor/*.so /usr/local/lib/ && \
    ln -s /usr/local/lib/libnlopt.so /usr/local/lib/libnlopt.so.0 && \
    \
    pip install -U pip && \
    pip install -r /requirements/production.txt --no-cache-dir && \
    \
    rm -rf /requirements /vendor

WORKDIR /app

COPY ./dist/bmds_server-$BMDS_SERVER_VERSION.tar.gz /app/bmds_server.tar.gz

RUN tar -xf bmds_server.tar.gz --strip-components=1 && \
    rm /app/bmds_server.tar.gz && \
    pip install -e . && \
    chown -R app:app /app

USER app

ENV LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH

ENTRYPOINT ["/app/bin/entrypoint.sh"]
