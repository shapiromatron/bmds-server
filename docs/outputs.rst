Output API
==========

The output JSON object contains all input settings, all outputs, model-
recommendations, and intermediate files (the raw ``.(d)`` and ``.out`` outfiles)
by the BMDS software. As a result, the JSON output files are large and complex.
This describes the format of the JSON data.

.. note::
    When using the API, the JSON response contains a number of other output
    fields, including fields like ``id``, ``inputs``, ``errors``, ``is_finished``,
    ``has_errors``, etc. This section desribes the ``outputs`` field.

.. _json: https://docs.python.org/3/library/json.html
.. _jsonlite: https://cran.r-project.org/web/packages/jsonlite/index.html

For the DIY...
--------------

JSON parsing is available in most modern languages. In Python, use the native
json_ module; in R, use the jsonlite_ package. To load the output file (in Python):

.. code:: python

    import os
    import json

    fn = os.path.expanduser('~/Desktop/bmds-server-outputs.json')
    with open(fn, 'r') as f:
        txt = json.load(f)

To get a quick view of what's available:

.. code:: python

    # remove the long input and output files so we can read
    for op in txt['outputs']:
        for model in op['models']:
            if 'outfile' in model:
                model['outfile'] = '...'
            if 'dfile' in model:
                model['dfile'] = '...'

    print(json.dumps(txt, indent=2))

Output structure
----------------

The top-level JSON object is an object with three fields:

- ``job_id``: The string identifier for the JOB
- ``inputs``: The :doc:`inputs </inputs>` object for this job (with datasets removed)
- ``outputs``: An array of output_ objects, one for each dataset in the input file

.. _output: `Output object`_

Output object
~~~~~~~~~~~~~

An output object contains all inputs and outputs for a single dataset. It contains
the following keys:

- ``dataset``: The dataset specified by the user which was modeled
- ``models``: An array of model_ objects, one for each model which was specified to be executed
- ``recommended_model_index``: If model-recommendation was enabled, the index (zero-indexed) of the recommended model. If the value is `null`, then no model was recommended.

.. _model: `Model object`_

Model object
~~~~~~~~~~~~

A model object contains all inputs and outputs for a BMDS model which was attempted
to be executed. It contains the following keys:

- ``name``: The model name, as defined in :ref:`model names <model-names>`
- ``dfile``: The ``*.(d)`` file which was created for execution
- ``has_output``: A boolean to determine if an .out file was created
- ``outfile``: The ``*.out`` file which was created after model execution
- ``output``: An instance of a `Model output object`_, if an output file is available

If model-recommendation was enabled (as described in `Wignall et al. 2014`_),
these values are also available:

- ``logic_bin``: The selected bin for this model (smaller is better). Possible values include:
    - 0: No serious warnings
    - 1: Serious warnings
    - 2: Unusable
- ``logic_notes``: Notes for why model was placed in each bin
- ``recommended``: Boolean true/false indicating if this is the recommended model
- ``recommended_variable``: If model is recommended, the basis for recommendation (e.g. lowest BMDL or lowest AIC)

.. _`Wignall et al. 2014`: https://dx.doi.org/10.1289/ehp.1307539

Model output object
~~~~~~~~~~~~~~~~~~~

Finally, if the model successfully executes the ``*.out`` file is parsed and
key values are captured in this object. The following summary data are available:

- ``model_name``: The model name, as defined in :ref:`model names <model-names>`
- ``model_date``: The datestamp for the executed model
- ``model_version``: The reported version of the executed model
- ``parameters``: A `Model parameters object`_, as described below

A tabular-summary of observed versus estimated values are also captured:

- ``fit_dose``: An array of doses (should be the same as input file)
- ``fit_size``: An array of ns (should be the same as input file)
- For continuous datasets:
    - ``fit_stdev``: An array of stdevs (should be the same as input file)
    - ``fit_observed``: An array of response means (should be the same as input file)
    - ``fit_estimated``: An array of response means as estimated by the model
    - ``fit_est_stdev``: An array of stdevs as estimated by the model
- For dichotomous datasets:
    - ``fit_observed``: An array of counts (should be the same as input file)
    - ``fit_estimated``: An array of response as estimated by the model
    - ``fit_est_prob``: An array of fractional-response as estimated by the model
- ``fit_residuals``: The calculated residual for each response
- ``residual_of_interest``: The residual closest to the estimated BMD

Finally, results are presented here:

- ``AIC``: The AIC value
- ``BMD``: The BMD value
- ``BMDL``: The BMDL value
- ``BMDU``: The BMDU value
- ``CSF``: The CSF value (dichotomous-cancer only)
- ``Chi2``: The Chi2 value
- ``df``: The degrees of freedom
- ``p_value1``: For (continuous), pvalue 1
- ``p_value2``: For (continuous), pvalue 2
- ``p_value3``: For (continuous), pvalue 3
- ``p_value4``: For (continuous), pvalue 4, the pvalue for dichtomous
- ``warnings``: An array of any textual warnings in the output file

Model parameters object
~~~~~~~~~~~~~~~~~~~~~~~

The parameters object has a key for each parameter-name. The value for
each parameter-name is a parameter object, which may have the following
key-value pairs: ``estimate``, ``stdev``, ``95_high_limit``, ``95_low_limit``.

For example, here is the model parameter object for a Linear model w/
modeled variance:

.. code:: javascript

    "parameters": {
        "beta_0": {
          "estimate": 35.2774,
          "stdev": 0.986006,
          "95_high_limit": 37.21,
          "95_low_limit": 33.3449
        },
        "beta_1": {
          "estimate": 0.00738006,
          "stdev": 0.000543821,
          "95_high_limit": 0.00844593,
          "95_low_limit": 0.00631419
        },
        "lalpha": {
          "estimate": -3.46735,
          "stdev": 2.02587,
          "95_high_limit": 0.503273,
          "95_low_limit": -7.43798
        },
        "rho": {
          "estimate": 1.87412,
          "stdev": 0.521894,
          "95_high_limit": 2.89701,
          "95_low_limit": 0.851223
        }
      }
