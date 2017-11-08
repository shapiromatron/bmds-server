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
    - v3.6.2 or higher
    - Run as an administrator
        - Don't install in default location (in a user's home), use custom location, ``C:\Python36``
        - install launcher for  all users, add to PATH
        - make sure to install `tcl/tk tkinter` option
    - Enable python to be used (run Powershell as administrator):
        ``Set-ExecutionPolicy Unrestricted``
    - Download `pywin32`_ library (we will install later in a virtual environment)
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

.. _Python: https://www.python.org/downloads/
.. _pywin32: https://sourceforge.net/projects/pywin32/
.. _Git: https://git-scm.com/download/win
.. _Erlang: http://www.erlang.org/downloads
.. _RabbitMQ: http://www.rabbitmq.com/download.html

Application setup
~~~~~~~~~~~~~~~~~

Install the software in a location where IIS will have access. In the example above, we've used the location ``C:\apps\bmds-server``. Assuming this is the case, run the following commands in PowerShell::

    mkdir C:\apps
    cd C:\apps
    git clone https://github.com/shapiromatron/bmds-server

    # create/install virtualenv
    python -m venv venv
    call ./venv/Scripts/activate

    # install remaining requirements which can be pip-installed
    pip install -r ./bmds-server/requirements/production.txt

    # install pywin32 into virtual environment
    easy_install.exe ~\Downloads\pywin32-220.win32-py3.5.exe

    # copy secrets.json
    cp ./bmds_server/secrets.example.json ./bmds_server/secrets.json

    # install bmds on github to run the latest (optional)
    git clone https://github.com/shapiromatron/bmds
    pip uninstall bmds
    pip install -e ./bmds

Update the ``secrets.json`` file with actual secrets. These secrets are pulled
from the environment settings in all areas where the software may be executed
(in activate.bat and Activate.ps1 for the virtual environment, web.config,
and the celery background process).

To deploy and redeploy
~~~~~~~~~~~~~~~~~~~~~~

Activate the virtual environment:

    call c:\apps\venv\Scripts\activate.bat
    cd c:\apps\bmds-server

An example deployment script is available in ``./bin/deploy.bat``.  The deployment
script checks out a particular version of the source code, updates the python
environment, syncs the database, (re)installs services, and restarts the webserver.

More generally, to sync secrets, run the command::

    python manage.py sync_secrets

To install the celery services::

    python run_cherrypy_winservice.py install
    python run_celery_winservice.py install
    python run_celerybeat_winservice.py install

You can update services::

    python run_cherrypy_winservice.py update
    python run_celery_winservice.py update
    python run_celerybeat_winservice.py update

To remove services::

    python run_cherrypy_winservice.py remove
    python run_celery_winservice.py remove
    python run_celerybeat_winservice.py remove

To check on start service::

    python run_cherrypy_winservice.py start
    python run_celery_winservice.py start
    python run_celerybeat_winservice.py start

To check on service status::

    sc query bmds_server
    sc query bmds_celery
    sc query bmds_celerybeat

To get services to restart on reboot, modify the settings for the services in the "Service" tab and change the "Startup type" to "Automatic".

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
