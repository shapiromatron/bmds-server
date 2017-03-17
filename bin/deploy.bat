:: Deploy BMDS webserver application.
::
:: The script uses git repositories instead of any python packages. It checks
:: out the desired branch of bmds-server and bmds, symlinks the bmds version
:: to virtual environment, updates any services, updates, django, and then
:: restarts all services and IIS web application.
::
::  Input should be set in the SET ENVIRONMENT VARIABLES section.

@echo off

:: ------------------------
:: SET ENVIRONMENT VARIBLES
:: ------------------------

:: path to python virtual environment
set VENV_PATH=C:\path\to\venv

:: path to bmds-server repository root and desired branch
set BMDS_SERVER_PATH=C:\path\to\bmds-server
set BMDS_SERVER_BRANCH=master

:: path to bmds repository root and desired branch
set BMDS_PATH=C:\path\to\bmds
set BMDS_BRANCH=master

:: -----------------------------------
:: FINISH SETTING ENVIRONMENT VARIBLES
:: -----------------------------------


echo -----------------------------------
echo Getting the latest BMDS server code
echo -----------------------------------
cd %BMDS_SERVER_PATH%
git fetch --all
git checkout %BMDS_BRANCH%
git merge --ff
git reset --hard origin/%BMDS_BRANCH%


echo ----------------------------
echo Getting the latest BMDS code
echo ----------------------------
cd %BMDS_PATH%
git fetch --all
git checkout %BMDS_SERVER_BRANCH%
git merge --ff
git reset --hard origin/%BMDS_SERVER_BRANCH%


echo -----------------------------------
echo Updating python/django requirements
echo -----------------------------------
CALL %VENV_PATH%\Scripts\activate.bat

:: install bmds-server requirements
pip install -r .\requirements\production.txt

:: remove bmds-server bmds requirement and use the local package
pip uninstall bmds -y
pip install -e %BMDS_PATH%

:: sync staticfiles and database
python manage.py collectstatic --no-input
python manage.py migrate --no-input


echo ----------------------------
echo Sycing environment variables
echo ----------------------------
python manage.py sync_secrets


echo ------------------------------------
echo Installing/Updating Windows services
echo ------------------------------------
:: http://stackoverflow.com/a/24419705/906385/
:: http://stackoverflow.com/questions/4983508/
sc query bmds_celery | find "does not exist" >nul
if %ERRORLEVEL% EQU 0 (
    echo Installing bmds_celery service.
    python run_celery_winservice.py install
) else (
    echo Updating bmds_celery service.
    sc stop bmds_celery
    python run_celery_winservice.py update
)

sc query bmds_celerybeat | find "does not exist" >nul
if %ERRORLEVEL% EQU 0 (
    echo Installing bmds_celerybeat service.
    python run_celerybeat_winservice.py install
) else (
    echo Updating bmds_celerybeat service.
    sc stop bmds_celerybeat
    python run_celerybeat_winservice.py update
)


echo ---------------------
echo (Re)starting services
echo ---------------------
sc start bmds_celery
sc start bmds_celerybeat


echo --------------------
echo Restarting webserver
echo --------------------
iisreset.exe


echo -----------------------
echo Checking service status
echo -----------------------
timeout /t 5
sc query bmds_celery
sc query bmds_celerybeat


echo ---------
echo Complete!
echo ---------


pause
