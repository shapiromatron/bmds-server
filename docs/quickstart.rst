Quickstart
==========

While BMDS server does have a simple html form for submitting jobs
and waiting for results, it's designed as a microservice to be used by other
applications.

Below, we present a simple example in Python. In addition to the standard
library, this uses the excellent
`requests <http://docs.python-requests.org/en/master/>`__ library for
handling HTTP requests.

.. code:: python

    import json
    import os
    import requests
    import time

    # set the URL root to the address where BMDS server is currently running
    url_root = os.environ.get('BMDS_SERVER_URL', 'http://bmds-server.com')

This example includes executing using BMDS version 2.6.0.1. with two
dichotomous datasets:

.. code:: python

    inputs = {
        "dataset_type": "D",
        "bmds_version": "BMDS2601",
        "datasets": [
            {
                "doses": [0, 1.96, 5.69, 29.75],
                "ns": [75, 49, 50, 49],
                "incidences": [5, 1, 3, 14]
            },
            {
                "doses": [0, 1.96, 5.69, 29.75],
                "ns": [75, 49, 50, 49],
                "incidences": [0, 0, 11, 27]
            }
        ]
    }

We submit the dataset to the job API:

.. code:: python

    url = '{}/api/job/'.format(url_root)
    data = {'inputs': json.dumps(inputs)}
    r = requests.post(url, data)

If submission is successful, we'll get a HTTP 201 response (job
created), along with a new random unique ideniter for this job:

.. code:: python

    if r.status_code == 201:
        job_id = r.json()['id']

Each job is added to a queue on the server; when there are no other jobs
running this job will be started. We can poll the results page (in this
case waiting 15 seconds between requests) until the job is finished:

.. code:: python

    # poll the site until the job is complete
    url = '{}/api/job/{}/'.format(url_root, job_id)
    while True:
        print('Polling outputs... sleeping for 15 seconds...')
        time.sleep(15)
        r = requests.get(url)
        response = r.json()
        if response['is_finished']:
            print('Job complete!')
            break


.. parsed-literal::

    Polling outputs... sleeping for 15 seconds...
    Job complete!


.. caution::
    By default, API requests are throttled to 10/minute; please don't poll for
    results more quickly than this or you will be throttled.

After completion, the job returns model outputs. There's lots of
information in the outputs, including the created dfile, output file,
and results from the parsed output. If model-recommendations is enabled,
then a model will also be recommended in the outputs. Here's a
snapshot of what's available.

.. code:: python

    outputs = response['outputs']
    for dataset in outputs:
        print('----')
        print('Dataset: {}'.format(json.dumps(dataset['dataset'], indent=2)))
        print('Number of models: {}'.format(len(dataset['models'])))
        for model in dataset['models']:
            print('  {}: BMD -> {}'.format(
                model['output']['model_name'],
                model['output']['BMD'])
            )


.. parsed-literal::

    ----
    Dataset: {
      "doses": [
        0,
        1.96,
        5.69,
        29.75
      ],
      "ns": [
        75,
        49,
        50,
        49
      ],
      "incidences": [
        5,
        1,
        3,
        14
      ]
    }
    Number of models: 7
      Logistic: BMD -> 17.4361
      LogLogistic: BMD -> 18.8518
      Probit: BMD -> 16.4765
      LogProbit: BMD -> 16.4497
      Multistage: BMD -> 18.0607
      Gamma: BMD -> 18.395
      Weibull: BMD -> 19.4127
    ----
    Dataset: {
      "doses": [
        0,
        1.96,
        5.69,
        29.75
      ],
      "ns": [
        75,
        49,
        50,
        49
      ],
      "incidences": [
        0,
        0,
        11,
        27
      ]
    }
    Number of models: 7
      Logistic: BMD -> 11.1448
      LogLogistic: BMD -> 3.95746
      Probit: BMD -> 10.0593
      LogProbit: BMD -> 5.38949
      Multistage: BMD -> 3.74054
      Gamma: BMD -> 4.04253
      Weibull: BMD -> 3.92577

