from copy import deepcopy
from django.contrib.auth.models import User
from django.test import Client
import json
import time
import bmds

from bmds.monkeypatch import _get_payload

from .fixtures import *  # noqa


@pytest.mark.django_db(transaction=False)
def test_drunner(complete_continuous):
    # create and login as superuser
    pw = 'admin'
    my_admin = User.objects.create_superuser('admin', 'admin@test.com', pw)
    c = Client()

    # get payload to submit
    dataset = complete_continuous['datasets'][0]
    cdataset = bmds.ContinuousDataset(**dataset)
    payload = bmds.monkeypatch._get_payload([
        bmds.models.Linear_220(cdataset),
        bmds.models.Power_218(cdataset)
    ])

    # assert login is required
    resp = c.post('/dfile/', payload)
    assert '/admin/login/' in resp.url
    assert resp.status_code == 302

    # assert response is successful post-login
    c.login(username=my_admin.username, password=pw)
    resp = c.post('/dfile/', payload)
    assert resp.status_code == 200

    # asset models were executed
    outputs = resp.json()
    assert len(outputs) == 2
    assert 'BMD =        99.9419' in outputs[0]['output']
    assert 'BMD = 99.9419' in outputs[1]['output']
