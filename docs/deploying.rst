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
    pip install -r ./requirements/production.txt

    # copy web-config
    cp ./web.config.example ./web.config

Next, set environment variables. You'll need to set the same variables in the following locations (with respect to ``bmds-server`` root path):

- ``./web.config``
- ``./venv/Scripts/Activate.ps1``
- ``./venv/Scripts/activate.bat``


Celery background process
~~~~~~~~~~~~~~~~~~~~~~~~~

This application creates long-running, tasks which runs thousands of curve-fits using BMDS. We do this asynchronously by using celery tasks. To run this service in the background on Windows, based on my research, two approaches can be used:

1. Create a service script and start
2. Use task-scheduler to ensure task is running in background

The task scheduler is an easier alternative, that feels more similar to linux deployment using supervisord for example. We'll try to use that approach. To do so, create a batch file (I call it ``start-celery.bat``)::

    :: active virtual environment and set environment variables
    CALL C:\inetpub\wwwroot\bmds-server\venv\Scripts\activate.bat

    :: set working directory
    cd C:\inetpub\wwwroot\bmds-server

    :: start celery workers
    celery worker^
     --app=bmds_server^
     --loglevel=info^
     --events^
     --logfile="C:\inetpub\wwwroot\bmds-server\celery.log"

Then, using Task Scheduler, setup a new task. Using the GUI:

- General: Run whether user is logged on or not
- Trigger: at system startup
- Actions: Start a program, ``C:\path\to\start-celery.bat``
- Conditions: (no changes)
- Settings:
    - If the task fails, restart
    - Don't stop the task if it runs too long
    - If the running task doesn't end when request, force stop
    - If the task is already running, don't start new instance
- Enable history logging

**Note:** Some online said that tasks would sometimes fire multiple instances with previous version of Windows server and task-schedule, but to date I haven't seen this.

To redeploy with updates
~~~~~~~~~~~~~~~~~~~~~~~~

1. Create a batch file like this, and run as administrator::

    CALL C:\inetpub\wwwroot\bmds-server\venv\Scripts\activate.bat
    cd C:\inetpub\wwwroot\bmds-server

    git fetch --all
    git reset --hard origin/master

    pip install -r .\requirements\production.txt
    python manage.py migrate --no-input
    python manage.py collectstatic --no-input

    iisreset.exe

2. Restart the celery worker manually in the Task Scheduler.

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
