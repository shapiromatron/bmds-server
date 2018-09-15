import json
import os
import requests
import time

# set the URL root to the address where BMDS server is currently running
url_root = os.environ.get("BMDS_SERVER_URL", "http://bmds-server.com")

# Create an example BMDS job. This example uses uses BMDS v2.6.0.1. with two
# dichotomous datasets:
inputs = {
    "id": "My first BMDS-server run",
    "dataset_type": "D",
    "bmds_version": "BMDS270",
    "datasets": [
        {
            "id": "run #1",
            "doses": [0, 1.96, 5.69, 29.75],
            "ns": [75, 49, 50, 49],
            "incidences": [5, 1, 3, 14],
        },
        {
            "id": 2,
            "doses": [0, 1.96, 5.69, 29.75],
            "ns": [75, 49, 50, 49],
            "incidences": [0, 0, 11, 27],
        },
    ],
}

# We submit the dataset to the job API:
url = "{}/api/job/".format(url_root)
data = {"inputs": json.dumps(inputs)}
r = requests.post(url, data)

# If submission is successful, we'll get a HTTP 201 response (job
# created), along with a new random unique identifier for this job:
if r.status_code == 201:
    job_id = r.json()["id"]

# Each job is added to a queue on the server; when there are no other jobs
# running this job will be started. We can poll the results page (in this
# case waiting 15 seconds between requests) until the job is finished:
url = "{}/api/job/{}/".format(url_root, job_id)
while True:
    print("Polling outputs... sleeping for 15 seconds...")
    time.sleep(15)
    r = requests.get(url)
    response = r.json()
    if response["is_finished"]:
        print("Job complete!")
        break

# After completion, the job returns model outputs. There's lots of
# information in the outputs, including the created dfile, output file,
# and results from the parsed output. If model-recommendations is enabled,
# then a model will also be recommended in the outputs. Here's a snapshot:
outputs = response["outputs"]
for dataset in outputs["outputs"]:
    print("----")
    print("Dataset: {}".format(json.dumps(dataset["dataset"], indent=2)))
    print("Number of models: {}".format(len(dataset["models"])))
    for model in dataset["models"]:
        print(
            "  {}: BMD -> {}".format(
                model["output"]["model_name"], model["output"]["BMD"]
            )
        )
