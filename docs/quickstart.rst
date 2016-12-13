Quickstart
==========

While BMDS server does have a simple html form for submitting jobs
and waiting for results, it's designed as a microservice to be used by other
applications.

**The general process for submitting a BMDS job is as follows:**

1. Submit a new job to the BMDS server, specifying input dataset(s) and options.
2. If the submission is formatted correctly, the server will reutrn a job-id.
3. Check the status of this job id every few seconds (or minutes, depending on the job size). When the job is complete, download results (or errors).

.. caution::
    By default, API requests are throttled to 10/minute; please don't poll for results more quickly than this or you will be throttled.

Python example
--------------

In addition to the standard library, the following packages are required:

- `requests <http://docs.python-requests.org/en/master/>`_

.. literalinclude:: quickstart.py
   :language: python
   :linenos:

R example
---------

In addition to the standard library, the following packages are required:

- `httr <https://cran.r-project.org/web/packages/httr/index.html>`_
- `plyr <https://cran.r-project.org/web/packages/plyr/index.html>`_
- `rjson <https://cran.r-project.org/web/packages/rjson/index.html>`_

.. literalinclude:: quickstart.r
   :language: r
   :linenos:
