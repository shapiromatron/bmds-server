Input API
=========

The BMDS server is designed to run multiple datasets using the same
model-settings for multiple BMDS models. The same settings are used for each
dataset in the list. Thus, to create a new BMDS run, it requires properly
specifying a single input file.

The input file must be in JSON format. Specifications are described in
`JSON schema`_ format.

.. _`JSON schema`: http://json-schema.org/

Job
~~~

The job object is the top-level object in the job-format. A single job object
is required for a BMDS analysis; and its settings are applied to all datasets
within the job. A simple example for continuous summary data would look like this:

.. code-block:: javascript

    {
        "bmds_version": "BMDS2601",
        "dataset_type": "C",
        "datasets": [ ... ]
    }

The datasets in the example above follow the `Datasets`_ schema, described below.

**Additional optional fields:**

- ``id`` <int or string>: Can be used as a unique identifier for the BMDS job;
  returned in the output so results can be mapped externally to BMDS server
  application.
- ``bmr`` <`BMR schema`_>: Specify the BMR definition for all models. If not
  specified, a default BMR value is used.
- ``models`` <`Models schema`_>: Specify a subset of BMDS models to be executed
  for each job. If not specified, by default all models which can be used for
  a particular dataset will be used (dependent on the number of dose-groups in
  a dataset).
- ``immediate`` <boolean, false by default>: If true and allowed by the server,
  then instead of running a job asynchronously, the job is executed immediately
  and results will be returned in the response to a job submission. For large
  jobs, this can result in response timeout errors and may block other requests
  by the server. If set to true, use with caution.
- ``recommend`` <boolean, true by default>: Should the software recommend a
  best fitting model? By default, set to true. Default model recommendation
  logic is used.

.. _`BMR schema`: BMR_
.. _`Models schema`: Models_

The complete specification is below:

.. code-block:: javascript

    {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "description": "BMDS version, dataset and dataset type,
                      model options, recommendation logic, etc.",
      "title": "BMDS job overview",
      "type": "object",
      "properties": {
        "id": {
          "description": "An (optional) unique identifier BMDS job",
          "type": [
            "integer",
            "string"
          ]
        },
        "bmds_version": {
          "description": "Version of BMDS run analysis with",
          "enum": [
            "BMDS230",  // BMDS version 2.3.0
            "BMDS231",  // BMDS version 2.3.1
            "BMDS240",  // BMDS version 2.4.0
            "BMDS260",  // BMDS version 2.6.0
            "BMDS2601"  // BMDS version 2.6.0.1
          ]
        },
        "dataset_type": {
          "description": "Type of data which should be executed
                          (should be same for all datasets)",
          "enum": [
            "D",        // Dichotomous data
            "DC",       // Dichotomous cancer
            "CI",       // Continuous individual
            "C"         // Continuous summary data
          ]
        },
        "datasets": {
          "type": "array",
          "description": "An array of datasets which will be executed",
          "minItems": 1
        },
        "models": {
            "description": "An array of models which should be used",
            "type": "array"
        },
        "bmr": {
            "description": "A description of the BMR to use",
            "type": "object"
        },
        "immediate": {
            "description": "Should execution start immediately
                            (and potentially block other requests)",
            "type": "boolean",
            "default": false
        },
        "recommend": {
            "description": "Should best fitting model be recommended?",
            "type": "boolean",
            "default": true
        }
      },
      "required": [
        "bmds_version",
        "dataset_type",
        "datasets"
      ]
    }

Datasets
~~~~~~~~

Datasets are specified as an array of multiple datasets; while it is possible
to run the BMDS server for a single dataset (just create an array of 1), the
server is designed to run dozens or even hundreds of datasets simultaneously.

The datasets field is one of the required field on the Job_ dataset above, and
is a required array. Each dataset in a dataset array has its own requirements,
as described below, depending on the dataset type.

In addition to the data specifications by data-type below, a number of optional
metadata fields are also available for use in all dataset types:

- ``id`` <int or string>: Can be used as a unique identifier for each dataset
  to correspond to existing frameworks external to the BMDS server; returned in
  the output so results can be mapped externally to BMDS server application.
- ``xlabel`` <str, default to "Dose">: the x-label on plot outputs
- ``ylabel`` <str, default to "Fraction affected" for Dichotomous or "Response"
  for Continuous>: the y-label on plot outputs
- ``dose_units`` <str>: the dose units to print in reporting
- ``response_units`` <str>: the response units to print in reporting


Dichotomous
-----------

A dichotomous dataset consists of a collection of dose groups, the total
observations, and positive observations. Thus, it is count data, as an example:

.. code-block:: javascript

    {
        "doses": [0, 1.96, 5.69, 29.75],
        "ns": [75, 49, 50, 49],
        "incidences": [5, 1, 3, 14]
    }

The complete specification is below:

.. code-block:: javascript

    {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "description": "Requirements for an array of dichotomous datasets",
      "title": "Dichotomous datasets"
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": [
          "doses",
          "ns",
          "incidences"
        ],
        "properties": {
          "id": {
            "description": "An (optional) unique identifier for dataset",
            "type": [
              "integer",
              "string"
            ]
          },
          "xlabel": {
            "description": "An (optional) x-label for plots",
            "type": "string"
          },
          "ylabel": {
            "description": "An (optional) y-label for plots",
            "type": "string"
          },
          "dose_units": {
            "description": "(optional) dose units for reporting",
            "type": "string"
          },
          "response_units": {
            "description": "(optional) response units for reporting",
            "type": "string"
          },
          "doses": {
            "type": "array",
            "description": "An array of doses (float),
                            one for each dose-group",
            "minItems": 3,
            "items": {
              "type": "number",
              "minimum": 0
            }
          },
          "ns": {
            "type": "array",
            "description": "An array of total Ns (int),
                            one for each dose-group",
            "minItems": 3,
            "items": {
              "type": "integer",
              "minimum": 0,
              "exclusiveMinimum": true
            }
          },
          "incidences": {
            "type": "array",
            "description": "An array of positive responses (int),
                            one for each dose-group",
            "minItems": 3,
            "items": {
              "type": "integer",
              "minimum": 0
            }
          }
        }
      }
    }

Dichotomous Cancer
------------------

The input format is identical to Dichotomous_ data. It's a separate dataset-type
because the model recommendation logic is slightly different.

Continuous Individual
---------------------

A continuous individual dataset consists of a collection of individual
dose-response relationships, one for each organism or replicate. As an example:

.. code-block:: javascript

    {
        "doses": [
            0, 0, 0, 0, 0, 0, 0, 0,
            0.1, 0.1, 0.1, 0.1, 0.1, 0.1,
            1, 1, 1, 1, 1, 1,
            10, 10, 10, 10, 10, 10,
            100, 100, 100, 100, 100, 100,
            300, 300, 300, 300, 300, 300,
            500, 500, 500, 500, 500, 500,
        ],
        "responses": [
            8.1079, 9.3063, 9.7431, 9.781, 10.052, 10.613, 10.751, 11.057,
            9.1556, 9.6821, 9.8256, 10.2095, 10.2222, 12.0382,
            9.5661, 9.7059, 9.9905, 10.2716, 10.471, 11.0602,
            8.8514, 10.0107, 10.0854, 10.5683, 11.1394, 11.4875,
            9.5427, 9.7211, 9.8267, 10.0231, 10.1833, 10.8685,
            10.368, 10.5176, 11.3168, 12.002, 12.1186, 12.6368,
            9.9572, 10.1347, 10.7743, 11.0571, 11.1564, 12.0368,
        ]
    }

The complete specification is below:

.. code-block:: javascript

    {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "description": "Requirements for continuous individual datasets",
      "title": "Continuous individual datasets",
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": [
          "doses",
          "responses"
        ],
        "properties": {
          "id": {
            "description": "An (optional) unique identifier for dataset",
            "type": [
              "integer",
              "string"
            ]
          },
          "xlabel": {
            "description": "An (optional) x-label for plots",
            "type": "string"
          },
          "ylabel": {
            "description": "An (optional) y-label for plots",
            "type": "string"
          },
          "dose_units": {
            "description": "(optional) dose units for reporting",
            "type": "string"
          },
          "response_units": {
            "description": "(optional) response units for reporting",
            "type": "string"
          },
          "doses": {
            "description": "Dose array (float), one per assay/organism",
            "type": "array",
            "items": {
              "type": "number",
              "minimum": 0
            },
            "minItems": 3
          },
          "responses": {
            "description": "Response array (float), one per assay/organism",
            "type": "array",
            "items": {
              "type": "number"
            },
            "minItems": 3
          }
        }
      }
    }

Continuous Summary
------------------

A continuous summary dataset consists of a collection of dose groups, the total
observations, and the mean-response and standard-deviation of response for
each dose-group, as an example:

.. code-block:: javascript

    {
        "doses": [0, 100, 500, 2500, 12500],
        "ns": [9, 10, 9, 10, 6],
        "means": [33.7, 34.9, 40.9, 56.7, 121.7],
        "stdevs": [5.0, 5.1, 6.2, 5.9, 18.1]
    }

The complete specification is below:

.. code-block:: javascript

    {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "description": "Requirements for an array of continuous datasets",
      "title": "Continuous  datasets",
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": [
          "doses",
          "ns",
          "means",
          "stdevs"
        ],
        "properties": {
          "id": {
            "description": "An (optional) unique identifier for dataset",
            "type": [
              "integer",
              "string"
            ]
          },
          "xlabel": {
            "description": "An (optional) x-label for plots",
            "type": "string"
          },
          "ylabel": {
            "description": "An (optional) y-label for plots",
            "type": "string"
          },
          "dose_units": {
            "description": "(optional) dose units for reporting",
            "type": "string"
          },
          "response_units": {
            "description": "(optional) response units for reporting",
            "type": "string"
          },
          "doses": {
            "type": "array",
            "description": "An array of doses (float),
                            one for each dose-group",
            "minItems": 3,
            "items": {
              "type": "number",
              "minimum": 0
            }
          },
          "ns": {
            "type": "array",
            "description": "An array of Ns (int),
                            one of each dose-group",
            "minItems": 3,
            "items": {
              "type": "integer",
              "minimum": 0,
              "exclusiveMinimum": true
            }
          },
          "means": {
            "type": "array",
            "description": "An array of response means (float),
                            one for each dose-group",
            "minItems": 3,
            "items": {
              "type": "number"
            }
          },
          "stdevs": {
            "type": "array",
            "description": "An array of response standard-deviations (float),
                            one for each dose-group",
            "minItems": 3,
            "items": {
              "type": "number"
            }
          }
        }
      }
    }

BMR
~~~

If specified, the BMR describes the BMR setting which is applied to all models,
for all datasets. An example for dichotomous data:

.. code-block:: javascript

    {
        "type": "Extra",
        "value": 0.1
    }

An example for continuous data (individual or summary):

.. code-block:: javascript

    {
        "type": "Std. Dev.",
        "value": 1
    }

.. important::

  If BMR  unspecified, a default will be used, which dataset-type specific:

    - Dichotomous data: 10% extra risk
    - Dichtomous cancer data: 10% extra risk
    - Continuous data (individual or summary): 1 standard deviation from control

The generic specification is below:

.. code-block:: javascript

    {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "title": "BMR validator",
      "description": "BMR specifications validator",
      "type": "object",
      "properties": {
        "value": {
          "minimum": 0,
          "type": "number",
          "description": "BMR value"
        },
        "type": {
          "enum": [  BMR_NAMES ]  // dataset type-specific
          "description": "BMR type"
        }
      },
      "required": [
        "type",
        "value"
      ]
    }

The ``BMR_NAMES`` options are dataset-type specific:

- Dichotomous data:
    - Extra
    - Added
- Dichotomous-cancer data:
    - Extra
- Continuous data (individual or summary):
    - Rel. Dev.
    - Std. Dev.
    - Abs. Dev.
    - Extra
    - Point

Models
~~~~~~

If specified, models dictates each of the models that will be executed for all
datasets in a BMDS job (where possible). Which models can be executed is dataset
specific, different models require different numbers of dose-groups. As an
example, to run a dataset with two models:

.. code-block:: javascript

    [
        {
            "name": "Logistic",
        },
        {
            "name": "LogLogistic",
        }
    ]

**Additional optional fields:**

- ``settings`` <`Model settings schema`_>: Specify any non-default settings to
  be applied to particular model. Default model-settings are used if this value
  is unspecified.

.. _`Model settings schema`: `Model settings`_

If ``models`` is not defined, all models which can be used for a particular
dataset will be used. The generic specification is below:

.. code-block:: javascript

    {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "title": "Model validator",
      "description": "List of valid models"
      "type": "array",
      "minItems": 1,
      "items": {
        "required": [
          "name"
        ],
        "type": "object",
        "properties": {
          "name": {
            "description": "BMDS model name",
            "enum": [  MODEL_NAMES ]  // dataset type-specific
          },
          "settings": {
            "description": "BMDS model-settings (model-type specific)",
            "type": "object"
          }
        }
      },
    }

.. _model-names:

Model names
-----------

The ``MODEL_NAMES`` described above are dataset-type specific:

- Dichotomous data:
    - Logistic
    - LogLogistic
    - Probit
    - LogProbit
    - Multistage
    - Gamma
    - Weibull
    - Dichotomous-Hill
- Dichotomous-cancer data:
    - Multistage-Cancer
- Continuous data (individual or summary):
    - Linear
    - Polynomial
    - Power
    - Hill
    - Exponential-M2
    - Exponential-M3
    - Exponential-M4
    - Exponential-M5

Model settings
--------------

In addition to specifying model-names, the user also has the option to specify
settings for each model. Model settings are optional, and do not need to be
applied if the user wishes to use the default settings.

As an example, to run a fourth-order polynomial model with modeled variance,
this would be an object in the ``models`` array

.. code-block:: javascript

    {
      "name": "Polynomial",
      "settings": {
        "degree_poly": 4,
        "constant_variance": 0
      }
    }

**Frequently-used model-settings:**

- To use constant/modeled variance (all Continuous models)
    - Use the ``constant_variance`` parameter
    - Default setting: calculated, based on result from ANOVA p-test 2 in BMDS
        - 0 = modeled variance :math:`Var(i) = \alpha * x(i)^\rho`
        - 1 = constant variance :math:`Var(i) = \alpha * x(i)`
    - Example: ``{constant_variance: 0}``
- To set the degree of polynomial (Polynomial, Multistage, or Multistage-Cancer):
    - Use the ``degree_poly`` parameter
    - Default setting: 2
    - Example: ``{degree_poly: 3}``
- To un-restrict/restrict continuous model parameters
    - For Hill, use ``restrict_n`` (1=True, 0=False): default is restricted
    - For Power, use ``restrict_power`` (1=True, 0=False): default is restricted
    - For Polynomial, use ``restrict_polynomial`` (1=Positive, -1=Negative,
      0=unrestricted): default is calculated based on if dataset is increasing
      or decreasing
- To un-restrict/restrict dichotomous model parameters
    - For Weibull, use ``restrict_power`` (1=True, 0=False): default is restricted
    - For Multistage, use ``restrict_beta`` (1=True, 0=False): default is restricted
    - For Multistage-Cancer, same as Multistage
    - For Gamma, use ``restrict_power`` (1=True, 0=False): default is restricted
    - For LogProbit, use ``restrict_slope`` (1=True, 0=False): default is restricted
    - For LogLogistic, use ``restrict_slope`` (1=True, 0=False): default is restricted
    - For Probit, use ``restrict_slope`` (1=True, 0=False): default is unrestricted
    - For Logistic, use ``restrict_slope`` (1=True, 0=False): default is unrestricted

.. warning::

  Due to the complexity of the model-settings and the multiple permutations that
  are available, there is no schema-validation or checking that the ``settings``
  are in the correct format or applied to a model.

  **Please check settings to ensure they are applied as intended the outputs, by
  examining the created dfile and/or outfile` execution.**
