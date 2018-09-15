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

Paths can change as needed, but in this case all content will be installed in ``C:\apps``. Assuming this is the case, run the following commands:

.. code-block:: batch

    mkdir c:\apps
    cd c:\apps
    git clone https://github.com/shapiromatron/bmds
    git clone https://github.com/shapiromatron/bmds-server

    :: create/install virtualenv
    python -m venv venv
    call c:\apps\venv\Scripts\activate.bat
    cd c:\apps\bmds-server\project

    :: install requirements
    pip install -r ..\requirements\production.txt

    :: copy (and modify) settings
    cp .\settings.example.ini .\settings.ini

    pip uninstall bmds
    pip install -e ..\bmds

    :: install services
    python ..\bin\services.py install

To setup the services so that they'll restart automatically on reboot, set startup type to "automatic (delayed)" in Windows Event Viewer.

In a virtualenv, you'll need to install pywin32 on the system (thanks `stack overflow`_):

.. _`stack overflow`: https://stackoverflow.com/a/34942168/906385

.. code-block:: batch

    call C:\apps\venv\Scripts\activate.bat
    python C:\apps\venv\Scripts\pywin32_postinstall.py -install

In some cases, you may also need to install pywin32 and pypiwin32 in both virtual environments and the main python install for services to start correctly.

Make sure Windows Firewall is setup and that ports 80 and optionally 443 are publicly available.


To (re)deploy
~~~~~~~~~~~~~~

.. code-block:: batch

    :: activate environment
    call C:\apps\venv\Scripts\activate.bat
    cd C:\apps\bmds-server\project

    :: reinstall packages
    pip install -r ..\requirements\production.txt
    pip uninstall bmds
    pip install -e ..\..\bmds

    :: run django commands and then restart services
    python manage.py migrate
    python manage.py collectstatic --no-input
    python ..\bin\services.py update
    python ..\bin\services.py restart
