import json
import time

import pytest
from django.test import Client
from django.urls import reverse


@pytest.mark.vcr()
@pytest.mark.django_db(transaction=False)
def test_successful_recommendation(bmds2_complete_dichotomous):
    # submit new job
    c = Client()
    payload = json.dumps(bmds2_complete_dichotomous)
    url = reverse("api:job-list")
    resp = c.post(url, {"inputs": payload})
    assert resp.status_code == 201

    # poll until job complete
    url = resp.json()["api_url"]
    while True:
        time.sleep(2)
        resp = c.get(url)
        if resp.json()["is_finished"]:
            break

    output = resp.json()["outputs"]["outputs"][0]

    rmi = output["recommended_model_index"]
    assert rmi == 3

    rm = output["models"].pop(rmi)
    assert rm["recommended"] is True
    assert rm["recommended_variable"] == "AIC"
    assert rm["logic_bin"] == 0

    for model in output["models"]:
        assert model["recommended"] is False
        assert model["recommended_variable"] is None
