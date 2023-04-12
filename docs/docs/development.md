# Development

Make sure you have the following applications installed locally:

- [Git](https://git-scm.com/)
- [Python](https://www.python.org/) == 3.11
- [Node.js](https://nodejs.org) == 18
- [Yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) >= 12

If installing on Windows, all requirements are available using [miniconda](https://docs.conda.io/en/latest/miniconda.html), and do not require administrative access.

## Initial setup

Instructions below have been written for bash, so should work out of the box for linux/mac. They may need to be adapted slightly for Windows.

Clone the repository and install all requirements into a virtual environment:


```bash
# clone repository; we'll put in ~/dev but you can put anywhere
mkdir -p ~/dev
cd ~/dev

# clone webserver package and execution package
git clone https://github.com/shapiromatron/bmds
git clone https://github.com/shapiromatron/bmds-server

# create virtual environment and install requirements
cd ~/dev/bmds-server
python -m venv venv

# activate the environment
source ./venv/bin/activate

# install requirements
./venv/bin/pip install -r ./requirements/dev.txt

# install package in developer mode and developer tools
pip install -e ../bmds
pip install -r requirements/dev.txt

# create the database
createuser --superuser --no-password bmds-online
createdb -E UTF-8 -U bmds-online bmds-online
```

## Running the application

You'll need to run both the python webserver and the node webserver to develop the application.

In one terminal, start the the python webserver:

```bash
# active python virtual environment
source ./venv/bin/activate

# install latest packages and requirements from code
make sync-dev

# sync db state with application state
manage.py migrate

# run development webserver
manage.py runserver
```

In another terminal, start the node frontend webserver:

```bash
# navigate to frontend folder
cd ./frontend

# install javascript dependencies
yarn

# start node hot-reloading server
npm start
```

If you navigate to [localhost](http://127.0.0.1:8000/) and see a website, you're ready to begin coding!


## Visual Studio Code settings

[Visual Studio Code](https://code.visualstudio.com/) is the recommended editor for this project.

Recommended extensions:

- [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python)
- [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Ruff](https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff)

Recommended workspace settings:

```json
{
    "restructuredtext.linter.disabled": true,
    "[html]": {
        "editor.formatOnSave": false
    },
    "[python]": {
        "editor.formatOnSave": true,
        "editor.formatOnPaste": false,
        "editor.codeActionsOnSave": {
            "source.fixAll": true
        }
    },
    "[javascript]": {
        "editor.formatOnSave": false,
        "editor.codeActionsOnSave": {
            "source.fixAll.eslint": true
        }
    },
    "editor.formatOnSave": true,
    "python.linting.flake8Enabled": false,
    "python.pythonPath": "./venv/bin/python",
    "eslint.workingDirectories": [
        "./frontend"
    ]
}
```
## Additional settings

### Feature flags (frontend)

Feature flags are enabled on the frontend so that if you're logged in as an administrator, you can features that are currently under development. To run the application in this mode:

- Login to the application as an administrator. If you're in the developer environment and started with the text fixture, an admin is available by going to `/user/login` and entering the credentials `admin@bmdsonline.org` and `pw`. After a successful login, you should see an admin tab on the top of the page
- Next, create a new analysis. You'll be taken to a new randomly generated URL, such as:
    - `http://127.0.0.1:8000/analysis/794236df-2684-4781-bb95-ad9a58293d15/gvl8lg6sayiw/`
- Change the URL to enable the `future` mode:
    - `http://127.0.0.1:8000/analysis/794236df-2684-4781-bb95-ad9a58293d15/gvl8lg6sayiw/?future=1`

That's it! Now you should be able to view content that's coming soon!

### Building a test database

A test database is loaded to run unit tests. The database may need to be periodically updated as new feature are added. To load, make edits, and export the test database:

```bash
# specify that we're using the unit-test settings
export "DJANGO_SETTINGS_MODULE=bmds_server.main.settings.testing"

# load existing test
createdb bmds-online-test
manage.py load_test_db

# make edits to the database using the GUI or via command line
# ...

# export database
manage.py dump_test_db
```

### Running asynchronous worker threads

This is an optional step in development, but required in production. To run workers, modify django settings and then start a few more processes:

```bash
# start the workers
source venv/bin/activate
celery worker --app=bmds_server.main.celery --loglevel=info --events

# start a crontab
source venv/bin/activate
celery beat --app=bmds_server.main.celery --loglevel=info
```

### Integration tests

Integration tests use [playwright](https://playwright.dev/python/). By default, integration tests are skipped when running pytest locally by default, but are always executed in github actions. To run:

```bash
# to run all
make test-integration

# or a custom method to run a single test
INTEGRATION_TESTS=1 py.test -sv tests/integration/test_dichotomous.py --pdb
```

When editing integration tests, use the interactive mode to capture user operations:

```bash
make test-integration-debug

# use set instead of export on windows
export INTEGRATION_TESTS=1
export PWDEBUG=1
py.test -sv tests/integration/test_dichotomous.py --pdb
```
