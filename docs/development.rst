Development
===========

Make sure you have the following applications installed locally:

- `Git`_
- `Python`_ == 3.6 (recommended to stay on Python 3.6 for some packages)
- `Node.js`_
- `Yarn`_

.. _`Git`: https://git-scm.com/
.. _`Python`: https://www.python.org/
.. _`Node.js`: https://nodejs.org
.. _`Yarn`: https://yarnpkg.com/
.. _`conda`: https://docs.conda.io/

If installing on Windows, all requirements are available via `conda`_ and do not require administrative access.

Initial setup
~~~~~~~~~~~~~

Instructions below have been written for bash, so should work out of the box for linux/mac. They may need to be adapted slightly for Windows.

Clone the repository and install all requirements into a virtual environment:

.. code-block:: bash

    # clone repository; we'll put in ~/dev but you can put anywhere
    mkdir -p ~/dev
    cd ~/dev
    git clone https://github.com/shapiromatron/bmds-server.git

    # create virtual environment and install requirements
    cd ~/dev/bmds-server
    python -m venv venv

    # activate the environment
    source ./venv/bin/activate

    # install requirements
    ./venv/bin/pip install -r ./requirements/dev.txt

    # for linux/mac running bmds==0.11.0 or lower
    echo "export \"BMDS_REQUEST_URL=http://bmds-python.com/api/dfile/\"" >> venv/bin/activate
    echo "export \"BMDS_TOKEN=abcdefghijklmnopqrstuvwxyz1234567890\"" >> venv/bin/activate

Running the application
~~~~~~~~~~~~~~~~~~~~~~~

You'll need to run both the python webserver and the node webserver to develop the application.

In one terminal, start the the python webserver:

.. code-block:: bash

    # active python virtual environment
    cd ~/dev/bmds-server
    source ./venv/bin/activate

    # sync db state with application state
    manage.py migrate

    # run development webserver
    manage.py runserver

In another terminal, run the node development webserver for javascript:

.. code-block:: bash

    # navigate to frontend folder
    cd ~/dev/bmds-server/frontend

    # install javascript dependencies
    yarn

    # start node hot-reloading server
    npm start

If you navigate to `localhost`_ and see a website, you're ready to begin coding!

.. _`localhost`: http://127.0.0.1:8000/

Visual Studio Code settings
~~~~~~~~~~~~~~~~~~~~~~~~~~~

`Visual Studio Code`_ is the recommended editor for this project.

.. _`Visual Studio Code`: https://code.visualstudio.com/

Recommended extensions:

- `Python for vscode`_
- `Eslint for vscode`_

.. _`Python for vscode`: https://marketplace.visualstudio.com/items?itemName=ms-python.python
.. _`Eslint for vscode`: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

Recommended workspace settings:

.. code-block:: json

    {
        "restructuredtext.linter.disabled": true,
        "[html]": {
            "editor.formatOnSave": false
        },
        "[python]": {
            "editor.formatOnSave": true
        },
        "[javascript]": {
            "editor.formatOnSave": false,
            "editor.codeActionsOnSave": {
                "source.fixAll.eslint": true
            }
        },
        "editor.formatOnSave": true,
        "python.pythonPath": "./venv/bin/python",
        "python.linting.flake8Args": [
            "--config=.flake8"
        ],
        "eslint.workingDirectories": [
            "./frontend"
        ]
    }

Additional settings
~~~~~~~~~~~~~~~~~~~

Running asynchronous worker threads
-----------------------------------

This is an optional step in development, but required in production. To run workers, modify django settings and then start a few more processes:

.. code-block:: bash

    # start the workers
    source venv/bin/activate
    celery worker --app=bmds_server.main.celery --loglevel=info --events

    # start a crontab
    source venv/bin/activate
    celery beat --app=bmds_server.main.celery --loglevel=info


Integration tests
-----------------

Integration tests use selenium and Firefox or Chrome for for testing. By default, integration tests are skipped. Firefox appears to be more stable based on initial investigation for these tests To run, you'll need to set a few environment variables.

.. code-block:: bash

    export BMDS_INTEGRATION_TESTS=1
    export SHOW_BROWSER=1            # or 0 for headless
    export BROWSER="firefox"         # or "chrome"
    py.test -s tests/integration/ --pdb

When writing these tests, it's often easiest to write the tests in an interactive scripting environment like ipython or jupyter. This allows you to interact with the DOM and the requests much easier than manually re-running tests as they're written.
