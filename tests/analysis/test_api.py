import json

import pytest
from bmds.bmds3.recommender import RecommenderSettings
from django.urls import reverse
from rest_framework.test import APIClient

from bmds_server.analysis.models import Analysis

from .run3 import RunBmds3


@pytest.mark.django_db
class TestAnalysisViewset:
    def test_csrf(self, bmds3_complete_continuous):
        """By default CSRF validation is not applied when using APIClient."""
        client = APIClient(enforce_csrf_checks=True)
        client.defaults.update(SERVER_NAME="testserver")

        analysis = Analysis.objects.create()
        url = analysis.get_api_patch_inputs_url()

        # complete bmds3 continuous
        payload = {
            "editKey": analysis.password,
            "data": bmds3_complete_continuous,
        }

        # first test without token
        response = client.patch(url, payload, format="json")
        assert response.status_code == 403

        # get csrftoken
        response = client.get(analysis.get_edit_url())
        assert response.status_code == 200
        csrftoken = response.cookies["csrftoken"]

        # test with token (required some renaming of headers to match test client)
        response = client.patch(url, payload, format="json", HTTP_X_CSRFTOKEN=csrftoken.value)
        assert response.status_code == 200


@pytest.mark.django_db
class TestPatchInputs:
    def test_auth(self):
        client = APIClient()
        analysis = Analysis.objects.create()
        url = analysis.get_api_patch_inputs_url()

        # check HTTP verbs
        response = client.post(url, {}, format="json")
        assert response.status_code == 405
        assert response.json() == {"detail": 'Method "POST" not allowed.'}

        # check permission
        response = client.patch(url, {}, format="json")
        assert response.status_code == 403
        assert response.json() == {"detail": "You do not have permission to perform this action."}
        assert (
            client.patch(url, {"editKey": analysis.password[:2]}, format="json").status_code == 403
        )

        # check data
        payload = {"editKey": analysis.password}
        response = client.patch(url, payload, format="json")
        assert response.status_code == 400
        assert response.json() == ["A `data` object is required"]

    def test_partial(self):
        client = APIClient()
        analysis = Analysis.objects.create()
        url = analysis.get_api_patch_inputs_url()

        payload = {
            "editKey": analysis.password,
            "data": {"bmds_version": "BMDS330", "dataset_type": "C"},
        }
        response = client.patch(url, payload, format="json",)
        assert response.status_code == 400
        assert json.loads(response.json()[0])[0] == {
            "loc": ["datasets"],
            "msg": "field required",
            "type": "value_error.missing",
        }

        payload = {
            "editKey": analysis.password,
            "data": {"bmds_version": "BMDS330", "dataset_type": "C"},
            "partial": True,
        }
        response = client.patch(url, payload, format="json",)
        assert response.status_code == 200
        assert response.json()["inputs"] == payload["data"]

        payload["data"] = {
            "bmds_version": "BMDS330",
            "dataset_type": "C",
            "models": {"frequentist_restricted": ["ZZZ"]},
        }
        response = client.patch(url, payload, format="json",)
        assert response.status_code == 400
        assert json.loads(response.json()[0])[0] == {
            "loc": ["__root__"],
            "msg": "Invalid model(s) in frequentist_restricted: ZZZ",
            "type": "value_error",
        }

        payload["data"] = {
            "bmds_version": "BMDS330",
            "dataset_type": "C",
            "models": {"frequentist_restricted": ["Power"]},
            "recommender": RecommenderSettings.build_default().dict(),
        }
        response = client.patch(url, payload, format="json",)
        assert response.status_code == 200
        assert response.json()["inputs"] == payload["data"]

    def test_complete_continuous(self, bmds3_complete_continuous):
        client = APIClient()
        analysis = Analysis.objects.create()
        url = analysis.get_api_patch_inputs_url()

        # complete bmds3 continuous
        payload = {"editKey": analysis.password, "data": bmds3_complete_continuous}
        response = client.patch(url, payload, format="json")
        assert response.status_code == 200
        assert response.json()["inputs"] == payload["data"]

    def test_complete_dichotomous(self, bmds3_complete_dichotomous):
        client = APIClient()
        analysis = Analysis.objects.create()
        url = analysis.get_api_patch_inputs_url()

        # complete bmds3 dichotomous
        payload = {"editKey": analysis.password, "data": bmds3_complete_dichotomous}
        response = client.patch(url, payload, format="json")
        assert response.status_code == 200
        assert response.json()["inputs"] == payload["data"]


@pytest.mark.skipif(not RunBmds3.should_run, reason=RunBmds3.skip_reason)
@pytest.mark.django_db
class TestExecute:
    def test_execute(self, bmds3_complete_dichotomous):
        client = APIClient()
        analysis = Analysis.objects.create(inputs=bmds3_complete_dichotomous)
        assert analysis.started is None
        url = analysis.get_api_execute_url()

        # invalid key
        payload = {"editKey": analysis.password + "123"}
        response = client.post(url, payload, format="json")
        assert response.status_code == 403

        # valid key
        payload = {"editKey": analysis.password}
        response = client.post(url, payload, format="json")
        assert response.status_code == 200
        bmd = response.data["outputs"]["outputs"][0]["frequentist"]["models"][0]["results"]["bmd"]
        assert response.data["is_finished"] is True
        assert response.data["has_errors"] is False
        assert bmd == pytest.approx(164.3, rel=0.05)

    def test_reset_execute(self, bmds3_complete_dichotomous):
        client = APIClient()
        analysis = Analysis.objects.create(inputs=bmds3_complete_dichotomous)
        analysis.execute()
        url = analysis.get_api_execute_reset_url()

        # invalid key
        payload = {"editKey": analysis.password + "123"}
        response = client.post(url, payload, format="json")
        assert response.status_code == 403

        # valid key
        payload = {"editKey": analysis.password}
        response = client.post(url, payload, format="json")
        assert response.status_code == 200
        assert response.data["is_finished"] is False
        assert response.data["has_errors"] is False
        assert response.data["outputs"] == {}


@pytest.mark.skipif(not RunBmds3.should_run, reason=RunBmds3.skip_reason)
@pytest.mark.django_db
class TestModelSelection:
    def test_model_selection(self, bmds3_complete_dichotomous):
        client = APIClient()
        analysis = Analysis.objects.create(inputs=bmds3_complete_dichotomous)
        analysis.execute()

        url = analysis.get_api_url() + "select-model/"
        payload = {
            "data": {
                "dataset_index": 0,
                "option_index": 0,
                "selected": {"model_index": 0, "notes": "notes"},
            },
        }

        # invalid key
        payload["editKey"] = analysis.password + "123"
        response = client.post(url, payload, format="json")
        assert response.status_code == 403

        # selected model
        payload["editKey"] = analysis.password
        response = client.post(url, payload, format="json")
        assert response.status_code == 200
        value = response.data["outputs"]["outputs"][0]["frequentist"]["selected"]
        assert value == {"notes": "notes", "model_index": 0}

        # deselect model
        payload["data"]["selected"] = {"model_index": None, "notes": "no notes"}
        response = client.post(url, payload, format="json")
        assert response.status_code == 200
        value = response.data["outputs"]["outputs"][0]["frequentist"]["selected"]
        assert value == {"model_index": None, "notes": "no notes"}


@pytest.mark.django_db
class TestOpenApiSchema:
    def test_schema(self):
        client = APIClient()
        url = reverse("openapi")

        # admin required
        assert client.get(url).status_code == 403

        # with admin, success
        client.login(username="admin@bmdsonline.org", password="pw")
        resp = client.get(url)
        assert resp.status_code == 200
        assert "openapi" in resp.data
