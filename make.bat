@ECHO off

if "%~1" == "" goto :help
if /I %1 == help goto :help
if /I %1 == sync-dev goto :sync-dev
if /I %1 == docs goto :docs
if /I %1 == docs-serve goto :docs-serve
if /I %1 == test goto :test
if /I %1 == lint goto :lint
if /I %1 == format goto :format
if /I %1 == test-py goto :test-py
if /I %1 == lint-py goto :lint-py
if /I %1 == format-py goto :format-py
if /I %1 == test-js goto :test-js
if /I %1 == lint-js goto :lint-js
if /I %1 == format-js goto :format-js
goto :help

:help
echo.Please use `make ^<target^>` where ^<target^> is one of
echo.  sync-dev     sync dev environment after code checkout
echo.  docs         make documentation
echo.  docs-serve   serve documentation for writing
echo.  test         perform both test-py and test-js
echo.  lint         perform both lint-py and lint-js
echo.  format       perform both format-py and lint-js
echo.  test-py      run python tests
echo.  lint-py      check for pytho formatting issues via black and flake8
echo.  format-py    modify python code using black and show flake8 issues
echo.  test-js      run javascript tests
echo.  lint-js      check for javascript formatting issues
echo.  format-js    modify javascript code if possible using linters and formatters
goto :eof

:sync-dev
python -m pip install -U pip
pip install -r requirements/dev.txt
yarn --cwd frontend
manage.py migrate
goto :eof

:docs
mkdocs build -f docs/mkdocs.yml --strict
goto :eof

:docs-serve
mkdocs serve -f docs/mkdocs.yml -a localhost:8050
goto :eof

:lint
black . --check && flake8 .
npm --prefix .\frontend run lint
goto :eof

:format
black . && isort . && flake8 .
npm --prefix .\frontend run format
goto :eof

:lint-py
black . --check && flake8 .
goto :eof

:format-py
black . && isort -q . && flake8 .
goto :eof

:lint-js
npm --prefix .\frontend run lint
goto :eof

:format-js
npm --prefix .\frontend run format
goto :eof

:test
py.test
npm --prefix .\frontend run test-windows
goto :eof

:test-py
py.test
goto :eof

:test-js
npm --prefix .\frontend run test-windows
goto :eof
