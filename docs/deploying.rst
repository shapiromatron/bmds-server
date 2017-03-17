Deploying
=========

While this is a fairly standard Django + celery application, it requires to be deployed on a Windows server due to underlying BMDS software requirements. This is a bit of a nonstandard deployment procedure (for me at least; based on internet research it looks like I'm not alone). Fortunately, recent IIS updates make it easier to deploy using an environment that's more similar to reverse proxying, without having to deal with FastCGI settings.

Deployment has only been tested in the environment described below; it may be possible to install using other windows environments, but this is the only documented configuration.

System requirements
~~~~~~~~~~~~~~~~~~~

- OS version: Windows Server 2012 R2 Standard
- Server Manager: Build 6.3.9600.17238
- IIS: Version 8.5.9600
- Administrator rights

Installation requirements
~~~~~~~~~~~~~~~~~~~~~~~~~

- Python_
    - v3.5.2 or higher
    - Run as an administrator
        - Don't install in default location (in a user's home), use custom location, ``C:\Python35``
        - install launcher for  all users, add to PATH
    - Enable python to be used (run terminal as administrator):
        ``Set-ExecutionPolicy Unrestricted``
    - Download `pywin32`_ library (we will install later in a virtual environment)
    - Download `numpy+MKL`_ and `scipy`_ library (we can't pip-install directly)
- Git_
    - v2.10.2 or higher
    - 64-bit version
    - install as administrator
- Erlang_
    - v19.1 or higher
    - install as administrator
- RabbitMQ_
    - v3.6.5 or higher
    - install as administrator
- IIS configuration (Add ASP .NET)
    - In server manager, go to Manage -> Add Roles and Features -> Role-based or feature based installation
    - Server Roles -> Webserver IIS (check)
        - Server Roles -> WebServer IIS -> Web Server -> Application Development -> ASP .NET 4.5 (check)
- HttpPlatformHandler_
    - v1.2 or higher
    - Requires IIS configuration as described above before installing

.. _Python: https://www.python.org/downloads/
.. _pywin32: https://sourceforge.net/projects/pywin32/
.. _`numpy+MKL`: http://www.lfd.uci.edu/~gohlke/pythonlibs/
.. _scipy: http://www.lfd.uci.edu/~gohlke/pythonlibs/
.. _Git: https://git-scm.com/download/win
.. _Erlang: http://www.erlang.org/downloads
.. _RabbitMQ: http://www.rabbitmq.com/downloads.html
.. _HttpPlatformHandler: https://www.iis.net/downloads/microsoft/httpplatformhandler

IIS configuration
~~~~~~~~~~~~~~~~~
We'll configure IIS to install a new python application. In normal linux webserver
parlance, this would be equivalent to setting up nginx as a reverse proxy to a
Django web application, as well as serving static files directly.

- Create new site "pySite"
    - Under "Basic Settings"
        - Set Physical path as ``C:\inetpub\wwwroot\bmds-server``
        - (May need to set "Connect as" to test appropriate access permissions)
    - Under Bindings
        - Set port 80, IP address *

 - Create static file server from IIS
     - Under "pySite", click "Add Virtual Directory"
         - Under "Basic settings":
             - Alias: ``static``
             - Physical path: ``C:\inetpub\wwwroot\bmds-server\public``

Application setup
~~~~~~~~~~~~~~~~~

Install the software in a location where IIS will have access. In the example above, we've used the location ``C:\inetpub\wwwroot\bmds-server``. Assuming this is the case, run the following commands in PowerShell::

    cd C:\inetpub\wwwroot
    git clone https://github.com/shapiromatron/bmds-server
    cd ./bmds-server

    # create/install virtualenv
    python -m venv venv
    ./venv/Scripts/activate

    # install scipy into virtual environment
    pip install ~\Downloads\numpy‑1.11.2+mkl‑cp35‑cp35m‑win32.whl
    pip install ~\Downloads\scipy‑0.18.1‑cp35‑cp35m‑win32.whl

    # install remaining requirements which can be pip-installed
    pip install -r ./requirements/production.txt

    # install pywin32 into virtual environment
    easy_install-3.5.exe ~\Downloads\pywin32-220.win32-py3.5.exe

    # copy secrets.json
    cp ./secrets.example.json ./secrets.json

Update the ``secrets.json`` file with actual secrets. These secrets are pulled
from the environment settings in all areas where the software may be executed
(in activate.bat and Activate.ps1 for the virtual environment, web.config,
and the celery background process).

To deploy and redeploy
~~~~~~~~~~~~~~~~~~~~~~

An example deployment script is available in ``./bin/deploy.bat``.  The deployment
script checks out a particular version of the source code, updates the python
environment, syncs the database, (re)installs services, and restarts the webserver.

More generally, to sync secrets, run the command::

    python manage.py sync_secrets

To install the celery services::

    python run_celery_winservice.py install
    python run_celerybeat_winservice.py install

You can update services::

    python run_celery_winservice.py update
    python run_celerybeat_winservice.py update

To remove services::

    python run_celery_winservice.py remove
    python run_celerybeat_winservice.py remove

Troubleshooting
~~~~~~~~~~~~~~~

First, ensure application (and static files) load on localhost.

Next, open to the world. In Windows Firewall settings, opening port 80 for inbound/outbound TCP traffic.

If hosting on Amazon EC2, check Amazon firewall settings to ensure they're open for this instance.

Thanks ya'll
~~~~~~~~~~~~

Special thanks to all the resources for helping create a hello-world:

- http://www.hanselman.com/blog/AnnouncingRunningRubyOnRailsOnIIS8OrAnythingElseReallyWithTheNewHttpPlatformHandler.aspx
- http://netdot.co/2015/03/09/flask-on-iis/
- http://stackoverflow.com/questions/32312590/
- http://stackoverflow.com/questions/9378932/
- https://www.calazan.com/windows-tip-run-applications-in-the-background-using-task-scheduler/
