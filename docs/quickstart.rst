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
- `dplyr <https://cran.r-project.org/web/packages/dplyr/index.html>`_
- `jsonlite <https://cran.r-project.org/web/packages/jsonlite/index.html>`_

.. literalinclude:: quickstart.r
   :language: r
   :linenos:

Converting a dataframe
~~~~~~~~~~~~~~~~~~~~~~

Have your datasets in a dataframe? Here's how to convert from a dataframe to
a list of lists:

.. code-block:: r
   :linenos:

    # create a hypothetical data frame
    datasetsDf = data.frame(
        id=c(rep("run #1", 4), rep("run #2", 4)),
        doses=rep(c(0,1.96,5.69, 29.75), 2),
        ns=rep(c(75, 49, 50, 49), 2),
        means=c(479, 460, 462, 420, 2.61, 2.61, 2.96, 4.66),
        stdevs=c(43, 42, 39, 39, 0.36, 0.19, 0.17, 0.42)
    )

    # show what we just created
    print.data.frame(datasetsDf)
    #       id doses ns  means stdevs
    # 1 run #1  0.00 75 479.00  43.00
    # 2 run #1  1.96 49 460.00  42.00
    # 3 run #1  5.69 50 462.00  39.00
    # 4 run #1 29.75 49 420.00  39.00
    # 5 run #2  0.00 75   2.61   0.36
    # 6 run #2  1.96 49   2.61   0.19
    # 7 run #2  5.69 50   2.96   0.17
    # 8 run #2 29.75 49   4.66   0.42

    # convert into list of lists
    datasets <- lapply(split(datasetsDf, datasetsDf$id), function(x){
        x <- as.list(x);
        x[['id']] <- unique(x$id);
        return(x);
    })

    # remove names from top-level lists
    datasets <- unname(datasets)

    # Incorporate the datasets into the rest of the BMDS job
    inputs <- list(
        id='My second BMDS-server run',
        dataset_type='C',
        bmds_version='BMDS2601',
        datasets=datasets
    )

    # the rest is the same as the quickstart described above...
