Deployment
==========

Minimum hardware requirements:

- Linux
- 8 GB RAM (16 GB recommended)
- 2 processors (4-8 recommended)
- 100 GB HD space (SSD preferred)

Software requirements:

- docker and docker compose
- `fabric`_ is used for (semi) automated deployment; contact if you're interested and we can share ...

.. _fabric: http://www.fabfile.org/

Build and deploy
----------------

Build docker containers which can be deployed. These can be pushed to a container registry or
other approaches for sharing with the deployment target:

.. code-block:: bash

    # build containers
    source venv/bin/activate
    make build
    docker-compose -f compose/dc-build.yml --project-directory . build

To test-deploy the containers on your development computer:

.. code-block:: bash

    # go to a new directory
    cd ~/dev/temp
    mkdir -p bmdsserver-deploy
    cd bmdsserver-deploy

    # make shared volumes
    mkdir -p data/postgres/backups
    mkdir -p data/public
    mkdir -p data/private
    mkdir -p data/nginx

    # copy deployment settings
    cp ~/dev/bmds-server/compose/nginx/conf/nginx.example.conf ./data/nginx/nginx.conf
    cp ~/dev/bmds-server/compose/dc-deploy.yml ./docker-compose.yml
    cp ~/dev/bmds-server/compose/example.env ./.env

    # start containers, order is important
    # ... start the backend services
    docker-compose up -d redis postgres
    # ... one time filesystem/database changes
    docker-compose run --no-deps --rm sync
    # ... start applications
    docker-compose up -d web workers cron nginx

    # view logs
    docker-compose logs -f

    # should be running, a few example commands for testing
    # check static files
    curl -I http://127.0.0.1:9000/static/css/site.css
    # check django request
    curl -I http://127.0.0.1:9000/
    docker-compose exec web manage.py createsuperuser
    curl -I http://127.0.0.1:9000/a2921323-9711-45f7-9800-13adc4b41291/admin/login/

    # shut down containers
    docker-compose down

The same approach can be done in production, except please harden the deployment :) .
