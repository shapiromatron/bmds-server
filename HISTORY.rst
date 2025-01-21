=======
History
=======

v2025.01 (2025-01-21)
---------------------

*  Mark package as archived and recommend use of `bmds-ui`_ instead

.. _`bmds-ui`: https://pypi.org/project/bmds-ui/

v2023.03.1 (2023-03-21)
-----------------------

Updates software to use updated bmds core library, `v23.2`_.

In addition:

* Fix bug in admin dashboard

.. _`v23.2`: https://pypi.org/project/bmds/23.2/

v2023.03 (2023-03-03)
---------------------

Updates software to use updated bmds core library, `v23.1`_.

In addition:

* Added new admin dashboard
* Added polyk adjustment calculator (draft)

.. _`v23.1`: https://pypi.org/project/bmds/23.1/

v0.6 (2018-09-16)
-------------------
* Update to `BMDS v0.11.0`_
* Use black_ to standardize code formatting
* Update libraries to latest versions; including Django 2.1 LTS
* Add CI {tests, black, flake8}

.. _`BMDS v0.11.0`: https://bmds.readthedocs.io/en/latest/history.html#v0-11-0-2018-09-14
.. _black: https://black.readthedocs.io

v0.5.1 (2018-04-19)
-------------------
* Update to `BMDS v0.10.0`_

.. _`BMDS v0.10.0`: https://bmds.readthedocs.io/en/latest/history.html#v0-10-0-2018-04-11

v0.5 (2017-02-27)
-----------------
* Refactor application
* Updated deployment procedure
    - use ini file instead of environment variables
    - add instructions for installing as Windows services
* Update to `BMDS v0.9.1`_
* Update to `Bootstrap v4`_

.. _`Bootstrap v4`: https://getbootstrap.com/docs/4.0/getting-started/introduction/
.. _`BMDS v0.9.1`: https://bmds.readthedocs.io/en/latest/history.html#v0-9-1-2018-02-22


v0.4.1 (2017-11-07)
-------------------
* Update to `BMDS v0.9.0`_ (added BMDS version 2.7)
* Backwards-compatible updates to dataset API to include new optional dose/response units
* Updated deployment procedure

.. _`BMDS v0.9.0`: https://bmds.readthedocs.io/en/latest/history.html#v0-9-0-2017-11-07


v0.4.0 (2017-06-06)
-------------------
* Vacuum sqlite3 database after job deletion to propagate data removal
* Update to `BMDS v0.8.1`_
* Use asyncio for drunner tasks (unfortunately, more instable for linux/mac users)

.. _`BMDS v0.8.1`: https://bmds.readthedocs.io/en/latest/history.html#v0-8-1-2017-06-06


v0.3.0 (2017-03-17)
-------------------
* In addition to catching global errors in BMD execution, try to catch errors the individual dataset level. Therefore, if a batch has a thousand datasets and only one fails, note this, but return the successful results
* Log failed dataset with traceback
* Update docs on deployment procedure and simple R usage
* Update to `BMDS v0.7.0`_

.. _`BMDS v0.7.0`: https://bmds.readthedocs.io/en/latest/history.html#v0-7-0-2017-03-17


v0.2.4 (2017-03-03)
-------------------

* Updated to `BMDS v0.5.4`_ (don't run models w/ parameters > dose groups)

.. _`BMDS v0.5.4`: https://github.com/shapiromatron/bmds/blob/master/HISTORY.rst#v054-2017-02-15

v0.2.3 (2017-03-02)
-------------------

* Updated to `BMDS v0.5.3`_ (more resilient to bad dataset errors)

.. _`BMDS v0.5.3`: https://github.com/shapiromatron/bmds/blob/master/HISTORY.rst#v053-2017-02-15

v0.2.2 (2017-02-15)
-------------------

* Updated to `BMDS v0.5.2`_ (can run datasets with 3 dose groups w/o failure)

.. _`BMDS v0.5.2`: https://github.com/shapiromatron/bmds/blob/master/HISTORY.rst#v052-2017-02-15

v0.2.1 (2016-12-23)
-------------------

* Updated to `BMDS v0.5.0`_
* Minor updates to output JSON. See details in the `output documentation`_
    - For each output, added ``dataset_index`` integer.
    - For each model, added ``name``, ``model_index``, and ``model_version``

.. _`BMDS v0.5.0`: https://pypi.python.org/pypi/bmds/0.5.0
.. _`output documentation`: http://bmds-server.readthedocs.io/en/stable/outputs.html#output-structure

v0.2.0 (2016-12-14)
-------------------

* For continuous summary datasets, rename ``responses`` array to ``means``
* Added quickstart for using R
* Added the ability to enter continuous individual datasets
* Added new option on requests to allow ``immediate`` - if True and enabled on the server, a user can request an immediate response to a job, and therefore polling for results is no-longer required. False by default for server performance.

v0.1.0 (2016-12-05)
-------------------

* Initial release
