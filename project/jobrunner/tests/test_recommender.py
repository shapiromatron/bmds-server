from django.test import Client
import json
import time
import pytest

from .fixtures import *  # noqa


@pytest.mark.django_db(transaction=False)
def test_successful_recommendation(complete_dichotomous):
    # submit new job
    c = Client()
    payload = json.dumps(complete_dichotomous)
    resp = c.post('/api/job/', {'inputs': payload})
    assert resp.status_code == 201

    # poll until job complete
    url = '/api/job/{}/'.format(resp.json()['id'])
    while True:
        time.sleep(2)
        resp = c.get(url)
        if resp.json()['is_finished']:
            break

    output = resp.json()['outputs']['outputs'][0]

    rmi = output['recommended_model_index']
    assert rmi == 3

    rm = output['models'].pop(rmi)
    assert rm['recommended'] is True
    assert rm['recommended_variable'] == 'AIC'
    assert rm['logic_bin'] == 0

    for model in output['models']:
        assert model['recommended'] is False
        assert model['recommended_variable'] is None
