API
===

Notation here is described in `JSON schema`_ format.


.. _`JSON schema`: http://json-schema.org/

The job object
~~~~~~~~~~~~~~



The JSON specification is below:

.. code-block:: javascript

    {
      "type": "object",
      "properties": {
        "datasets": {
          "type": "array",
          "description": "An array of datasets which will be executed",
          "minItems": 1
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

Datasets.


Dichotomous & Dichotomous Cancer
--------------------------------

The input format for dichotomous and dichotomous cancer datasets are the same.

The complete json schema is below:

.. code-block:: javascript

    {
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
          "incidences": {
            "type": "array",
            "description": "An array of positive responses (int),
                            one for each dose-group",
            "minItems": 3,
            "items": {
              "type": "integer",
              "minimum": 0
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
            "description": "An array of total Ns (int),
                            one for each dose-group",
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


Continuous
----------

The input format for continuous is slightly different.

The complete json schema is below:

.. code-block:: javascript

    {
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
