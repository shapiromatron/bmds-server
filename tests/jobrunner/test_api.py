import pytest
from bmds.bmds3.recommender import RecommenderSettings
from rest_framework.test import APIClient

from bmds_server.jobrunner.models import Job


@pytest.mark.django_db
class TestJobViewset:
    def test_csrf(self, bmds3_complete_continuous):
        """By default CSRF validation is not applied when using APIClient."""
        client = APIClient(enforce_csrf_checks=True)
        client.defaults.update(SERVER_NAME="testserver")

        job = Job.objects.create()
        url = job.get_api_patch_inputs_url()

        # complete bmds3 continuous
        payload = {
            "editKey": job.password,
            "data": bmds3_complete_continuous,
        }

        # first test without token
        response = client.patch(url, payload, format="json")
        assert response.status_code == 403

        # get csrftoken
        response = client.get(job.get_edit_url())
        assert response.status_code == 200
        csrftoken = response.cookies["csrftoken"]

        # test with token (required some renaming of headers to match test client)
        response = client.patch(url, payload, format="json", HTTP_X_CSRFTOKEN=csrftoken.value)
        assert response.status_code == 200


@pytest.mark.django_db
class TestPatchInputs:
    def test_auth(self):
        client = APIClient()
        job = Job.objects.create()
        url = job.get_api_patch_inputs_url()

        # check HTTP verbs
        response = client.post(url, {}, format="json")
        assert response.status_code == 405
        assert response.json() == {"detail": 'Method "POST" not allowed.'}

        # check permission
        response = client.patch(url, {}, format="json")
        assert response.status_code == 403
        assert response.json() == {"detail": "You do not have permission to perform this action."}
        assert client.patch(url, {"editKey": job.password[:2]}, format="json").status_code == 403

        # check data
        payload = {"editKey": job.password}
        response = client.patch(url, payload, format="json")
        assert response.status_code == 400
        assert response.json() == ["A `data` object is required"]

    def test_partial(self):
        client = APIClient()
        job = Job.objects.create()
        url = job.get_api_patch_inputs_url()

        payload = {
            "editKey": job.password,
            "data": {"bmds_version": "BMDS330", "dataset_type": "C"},
        }
        response = client.patch(url, payload, format="json",)
        assert response.status_code == 400
        assert response.json() == ["'datasets' is a required property"]

        payload = {
            "editKey": job.password,
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
        assert response.json() == [
            "Model error(s): 'ZZZ' is not one of ['Exponential', 'Hill', 'Polynomial', 'Power']"
        ]

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
        job = Job.objects.create()
        url = job.get_api_patch_inputs_url()

        # complete bmds3 continuous
        payload = {
            "editKey": job.password,
            "data": bmds3_complete_continuous,
        }

        response = client.patch(url, payload, format="json")
        assert response.status_code == 200
        assert response.json()["inputs"] == payload["data"]

    def test_complete_dichotomous(self, bmds3_complete_dichotomous):
        client = APIClient()
        job = Job.objects.create()
        url = job.get_api_patch_inputs_url()

        # complete bmds3 dichotomous
        payload = {
            "editKey": job.password,
            "data": bmds3_complete_dichotomous,
        }

        response = client.patch(url, payload, format="json")
        assert response.status_code == 200
        assert response.json()["inputs"] == payload["data"]


class TestExecute:
    # TODO - add
    pass


class TestModelSelection:
    # TODO - add
    pass
