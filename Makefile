.PHONY: build clean clean-test clean-pyc clean-build docs help lint lint-py lint-js format format-py format-js sync-dev
.DEFAULT_GOAL := help

define BROWSER_PYSCRIPT
import os, webbrowser, sys
try:
	from urllib import pathname2url
except:
	from urllib.request import pathname2url

webbrowser.open("file://" + pathname2url(os.path.abspath(sys.argv[1])))
endef
export BROWSER_PYSCRIPT

define PRINT_HELP_PYSCRIPT
import re, sys

for line in sys.stdin:
	match = re.match(r'^([a-zA-Z_-]+):.*?## (.*)$$', line)
	if match:
		target, help = match.groups()
		print("%-20s %s" % (target, help))
endef
export PRINT_HELP_PYSCRIPT
BROWSER := python -c "$$BROWSER_PYSCRIPT"

help:
	@python -c "$$PRINT_HELP_PYSCRIPT" < $(MAKEFILE_LIST)

build:  ## build application for containerization
	manage.py set_git_commit
	rm -rf build/ dist/
	npm --prefix ./frontend run build
	python setup.py build
	python setup.py bdist_wheel

dev: ## Start developer environment.
	./bin/dev.sh

test: ## This runs all of the tests.

	# To run tests:
	#
	#  py.test --ds=bmds_server.settings.dev
	#
	#	- Use -k <MATCH> for test matching (e.g. -k test_this_thing)
	#	- Use -s for displaying print statements (or use pdb)
	#
	@py.test
	@npm --prefix ./frontend run test

test-integration:  ## Run integration tests (requires `npm run start`)
	@playwright install --with-deps chromium
	@INTEGRATION_TESTS=1 py.test -sv tests/integration/

test-integration-debug:  ## Run integration tests in debug mode (requires npm run start)
	@playwright install --with-deps chromium
	@INTEGRATION_TESTS=1 PWDEBUG=1 py.test -sv tests/integration/

docs: ## generate Sphinx HTML documentation, including API docs
	$(MAKE) -C docs clean
	$(MAKE) -C docs html
	$(BROWSER) docs/_build/html/index.html

lint: lint-py lint-js  ## Check for javascript/python for linting issues

format: format-py format-js  ## Modify javascript/python code

lint-py:  ## Check for python formatting issues via black & flake8
	@black . --check && isort -q --check . && flake8 .

format-py:  ## Modify python code using black & show flake8 issues
	@black . && isort -q . && flake8 .

lint-js:  ## Check for javascript formatting issues
	@npm --prefix ./frontend run lint

format-js:  ## Modify javascript code if possible using linters/formatters
	@npm --prefix ./frontend run format

sync-dev:  ## Sync dev environment after code checkout
	python -m pip install -U pip
	pip install -r requirements/dev.txt
	yarn --cwd frontend
	manage.py migrate
