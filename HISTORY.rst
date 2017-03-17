=======
History
=======

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
