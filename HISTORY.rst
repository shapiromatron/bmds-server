=======
History
=======

v0.2.1 (NEXT)
-------------------

* Minor updates to output JSON. See details in the `output documentation`_
    - For each output, added ``dataset_index`` integer.
    - For each model, added ``name``, ``model_index``, and ``model_version``

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
