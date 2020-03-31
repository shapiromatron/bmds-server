import json
import sys

import bmds
import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient


@pytest.mark.skipif(sys.platform != "win32", reason="requires Windows")
@pytest.mark.vcr()
@pytest.mark.django_db(transaction=False)
def test_drunner(complete_continuous):
    # create and login as superuser
    admin = User.objects.create_superuser("admin", "admin@test.com", "admin")
    token = Token.objects.create(user=admin)
    client = APIClient()

    # get payload to submit
    dataset = complete_continuous["datasets"][0]
    cdataset = bmds.ContinuousDataset(**dataset)
    payload = json.loads(
        bmds.monkeypatch._get_payload(
            [bmds.models.Linear_220(cdataset), bmds.models.Power_218(cdataset)]
        )
    )

    # assert login is required
    url = reverse("api:dfile-list")
    resp = client.post(url, payload, format="json")
    assert resp.status_code == 401

    # assert response is successful post-login
    client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
    resp = client.post(url, payload, format="json")
    assert resp.status_code == 200

    # asset models were executed
    outputs = resp.json()
    assert len(outputs) == 2
    assert "BMD =        99.9419" in outputs[0]["output"]
    assert "BMD = 99.9419" in outputs[1]["output"]
