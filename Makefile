.PHONY: clean clean-test clean-pyc clean-build docs help
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

dev: ## Start developer environment.
	./bin/dev.sh

test: ## This runs all of the tests.

	# To run an individual test, use the -k flag to grep for matching:
	# 	$ py.test -k test_monkey_has_tail
	#
	# To show print statements when debugging tests, use the -s flag:
	# 	$ py.test -k test_monkey_has_tail -s
	#
	py.test tests

docs: ## generate Sphinx HTML documentation, including API docs
	$(MAKE) -C docs clean
	$(MAKE) -C docs html
	$(BROWSER) docs/_build/html/index.html

servedocs: docs ## compile the docs watching for changes
	watchmedo shell-command -p '*.rst' -c '$(MAKE) -C docs html' -R -D .
