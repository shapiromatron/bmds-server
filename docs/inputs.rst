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
within the job. A simple example for continuous data would look like this:

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
            "C"         // Continuous
          ]
        },
        "datasets": {
          "type": "array",
          "description": "An array of datasets which will be executed",
          "minItems": 1
        },
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

**Additional optional fields:**

- ``id`` <int or string>: Can be used as a unique identifier for each dataset to
  correspond to existing frameworks external to the BMDS server; returned in the
  output so results can be mapped externally to BMDS server application.

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
            "type": [
              "integer",
              "string"
            ],
            "description": "An (optional) unique identifier for dataset"
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

Continuous
----------

A continuous dataset consists of a collection of dose groups, the total
observations, and the mean-response and stadard-deviation of response for
each dose-group, as an example:

.. code-block:: javascript

    {
        "doses": [0, 100, 500, 2500, 12500],
        "ns": [9, 10, 9, 10, 6],
        "responses": [33.7, 34.9, 40.9, 56.7, 121.7],
        "stdevs": [5.0, 5.1, 6.2, 5.9, 18.1]
    }

**Additional optional fields:**

- ``id`` <int or string>: Can be used as a unique identifier for each dataset to
  correspond to existing frameworks external to the BMDS server; returned in the
  output so results can be mapped externally to BMDS server application.

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
          "responses",
          "stdevs"
        ],
        "properties": {
          "responses": {
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

An example for continuous data:

.. code-block:: javascript

    {
        "type": "Std. Dev.",
        "value": 1
    }

.. important::

  If BMR  unspecified, a default will be used, which dataset-type specific:

    - Dichotomous data: 10% extra risk
    - Dichtomous cancer data: 10% extra risk
    - Continuous data: 1 standard deviation from control

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
- Continuous data:
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
          }
        }
      },
    }

The ``MODEL_NAMES`` described above are dataset-type specific:

- Dichotomous data:
    - Logistic
    - LogLogistic
    - Probit
    - LogProbit
    - Multistage
    - Gamma
    - Weibull
- Dichotomous-cancer data:
    - Multistage-Cancer
- Continuous data:
    - Linear
    - Polynomial
    - Power
    - Hill
    - Exponential-M2
    - Exponential-M3
    - Exponential-M4
    - Exponential-M5

.. admonition:: TODO

  In addition to simply specifying which models to run, also allow users to
  set parameters for each model. For example, you could set the polynomial
  model to run with ``n`` polynomial terms, or force datasets to run a
  constant or non-constant variance model. Or specify BMR settings.