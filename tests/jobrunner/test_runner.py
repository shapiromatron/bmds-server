import json
import time
from copy import deepcopy

import pytest
from django.test import Client
from django.urls import reverse


@pytest.mark.vcr()
@pytest.mark.django_db(transaction=False)
def test_d_success(bmds2_complete_dichotomous):
    # BMDS execution is slow; we overload this test to check lots of things.
    data = deepcopy(bmds2_complete_dichotomous)

    # use a single model for speed
    data["models"] = [{"name": "Logistic"}]

    # use alternative BMR definition
    data["bmr"] = {"type": "Extra", "value": 0.25}

    # submit new job
    c = Client()
    payload = json.dumps(data)
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

    # check alternative BMR definition
    outfile = resp.json()["outputs"]["outputs"][0]["models"][0]["outfile"]
    assert "Specified effect =           0.25" in outfile

    # check parsed model output exists
    bmd = resp.json()["outputs"]["outputs"][0]["models"][0]["output"]["BMD"]
    assert bmd == 29.5318


@pytest.mark.vcr()
@pytest.mark.django_db(transaction=False)
def test_c_success(bmds2_complete_continuous):
    # BMDS execution is slow; we overload this test to check lots of things.
    data = deepcopy(bmds2_complete_continuous)

    # use single model for speed; w/ a model override
    data["models"] = [{"name": "Polynomial", "settings": {"degree_poly": 3}}]

    # use alternative BMR definition
    data["bmr"] = {"type": "Std. Dev.", "value": 1.5}

    # submit new job
    c = Client()
    payload = json.dumps(data)
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

    # grab model of interest
    model = resp.json()["outputs"]["outputs"][0]["models"][0]

    # check that model is a 3rd order polynomial
    assert model["name"] == "Polynomial-3"
    assert model["model_name"] == "Polynomial"
    assert model["output"]["parameters"]["beta_3"]["estimate"] == 0.0

    # check alternative BMR definition
    assert "Specified effect =           1.5" in model["outfile"]

    # check parsed model output exists
    bmd = model["output"]["BMD"]
    assert bmd == 149.913


@pytest.mark.vcr()
@pytest.mark.django_db(transaction=False)
def test_ci_success(bmds2_complete_continuous_individual):
    # BMDS execution is slow; we overload this test to check lots of things.
    data = deepcopy(bmds2_complete_continuous_individual)

    # use single model for speed; w/ a model override
    data["models"] = [{"name": "Polynomial", "settings": {"degree_poly": 3}}]

    # submit new job
    c = Client()
    payload = json.dumps(data)
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

    # grab model of interest
    model = resp.json()["outputs"]["outputs"][0]["models"][0]

    # check that model is a 3rd order polynomial
    assert model["output"]["parameters"]["beta_3"]["estimate"] == 0.0

    # check alternative BMR definition
    assert "Specified effect =             1" in model["outfile"]

    # check parsed model output exists
    bmd = model["output"]["BMD"]
    assert bmd == 386.097
