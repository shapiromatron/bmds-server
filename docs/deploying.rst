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
    - Python.org or Anaconda
    - Enable in Powershell: ``Set-ExecutionPolicy Unrestricted``
- Git_ (≥ 2.10; 64-bit)
- Erlang_ (≥ 19.1)
- RabbitMQ_ (≥ 3.6)

.. _Python: https://www.python.org/downloads/
.. _Git: https://git-scm.com/download/win
.. _Erlang: http://www.erlang.org/downloads
.. _RabbitMQ: http://www.rabbitmq.com/download.html

Application setup
~~~~~~~~~~~~~~~~~

Install the software in a location where IIS will have access. In the example above, we've used the location ``C:\apps\bmds-server``. Assuming this is the case, run the following commands in PowerShell::

    mkdir c:\apps
    cd c:\apps
    git clone https://github.com/shapiromatron/bmds
    git clone https://github.com/shapiromatron/bmds-server

    # create/install virtualenv
    python -m venv venv
    call c:\apps\venv\Scripts\activate.bat
    cd c:\apps\bmds-server\project

    # install requirements
    pip install -r ..\requirements\production.txt

    # copy (and modify) settings
    cp .\settings.example.ini .\settings.ini

    pip uninstall bmds
    pip install -e ..\bmds

    # install application services on Windows; to restart automatically on
    # reboot set startup type to "automatic (delayed)" in Windows Event Viewer.
    python ..\bin\services.py install

To deploy
~~~~~~~~~

First-time and (updates)::

    call C:\apps\venv\Scripts\activate.bat
    cd C:\apps\bmds-server\project

    pip install -r ..\requirements\production.txt
    pip uninstall bmds
    pip install -e ..\..\bmds

    python manage.py migrate
    python manage.py collectstatic --no-input
    python ..\bin\services.py update
    python ..\bin\services.py restart
