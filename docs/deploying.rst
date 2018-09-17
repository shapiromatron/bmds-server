Deploying
=========

While this is a fairly standard Django + celery application, it requires to be deployed on a Windows server due to underlying BMDS software requirements. This is a bit of a nonstandard deployment procedure, but it seems to work fine when using CherryPy_ as the HTTP server under relatively small loads.

.. _CherryPy: http://cherrypy.org/

System requirements
~~~~~~~~~~~~~~~~~~~

- OS version: Windows Server 2012 R2 Standard
- Administrator rights

Installation requirements
~~~~~~~~~~~~~~~~~~~~~~~~~

Install all as administrator:

- Python_ (≥ 3.6)
- Git_ (≥ 2.10; 64-bit)
- Erlang_ (≥ 19.1)
- RabbitMQ_ (≥ 3.6)

Enable Python execution in Powershell: ``Set-ExecutionPolicy Unrestricted``.

.. _Python: https://www.python.org/downloads/
.. _Git: https://git-scm.com/download/win
.. _Erlang: http://www.erlang.org/downloads
.. _RabbitMQ: http://www.rabbitmq.com/download.html

Application setup
~~~~~~~~~~~~~~~~~

Paths can change as needed, but in this case all content will be installed in ``C:\apps``; paths are currently harcoded however in the ``\bin\services.py`` files so if paths are changed these will need to be modified.

.. code-block:: batch

    mkdir c:\apps
    cd c:\apps
    git clone https://github.com/shapiromatron/bmds-server

    :: optional; skip if you don't need bleeding-edge bmds library
    git clone https://github.com/shapiromatron/bmds

    :: create/install virtualenv
    python -m venv venv
    call c:\apps\venv\Scripts\activate.bat
    cd c:\apps\bmds-server\project

    :: install requirements
    pip install -r ..\requirements\production.txt

    :: copy (and modify) settings
    copy .\settings.example.ini .\settings.ini

    :: optional; skip if you don't need bleeding-edge bmds library
    pip uninstall bmds
    pip install -e ..\bmds

    :: install services
    python ..\bin\services.py install

Run these startup commands to create the database, etc.

.. code-block:: batch

    :: activate environment
    call C:\apps\venv\Scripts\activate.bat
    cd C:\apps\bmds-server\project

    python manage.py migrate
    python manage.py collectstatic --no-input
    python ..\bin\services.py start

Then, ensure each of the three application work outside of a windows services:

.. code-block:: batch

    call C:\apps\venv\Scripts\activate.bat
    cd C:\apps\bmds-server\project
    python manage.py run webapp
    python manage.py run celery_worker
    python manage.py run celery_beat

To deploy
~~~~~~~~~

Ensure pypiwin32 and pywin32 are in the virtualenv AND the **base python install** (thanks `stack overflow`_):

.. code-block:: batch

    :: outside virtual environment
    pip install pywin32 pypiwin32

    :: inside virtual environment
    call C:\apps\venv\Scripts\activate.bat
    python C:\apps\venv\Scripts\pywin32_postinstall.py -install

    cd C:\apps\bmds-server\project
    python ..\bin\services.py update
    python ..\bin\services.py start

After starting, you should be able to view the webserver and successfully submit a BMDS job and get a result back. At this time you may also choose to create users and then create API tokens for API access which requires elevated permissions.

Finally, setup the services so that they'll restart automatically on reboot, set startup type to "automatic (delayed)" in Windows Event Viewer. Then restart the server. After a few minutes, check to see if they services are working. If this doesn't work, you'll need to do some troubleshooting.

Make sure Windows Firewall is setup and that ports 80 and optionally 443 are publicly available.


To (re)deploy
~~~~~~~~~~~~~~

.. code-block:: batch

    :: update code
    cd C:\apps\bmds-server
    git fetch --all
    git reset --hard
    git checkout master
    git pull origin master

    :: activate environment
    call C:\apps\venv\Scripts\activate.bat
    cd C:\apps\bmds-server\project

    :: reinstall packages
    pip install -r ..\requirements\production.txt

    :: optional; for bleeding-edge only
    pip uninstall bmds
    pip install -e ..\..\bmds

    :: run django commands and then restart services
    python manage.py migrate
    python manage.py collectstatic --no-input
    python ..\bin\services.py update
    python ..\bin\services.py restart
