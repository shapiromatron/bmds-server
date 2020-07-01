import pytest
from rest_framework.test import APIClient

from bmds_server.jobrunner.models import Job


@pytest.mark.django_db
class TestPatchInputs:
    def test_auth(self):
        client = APIClient()
        job = Job.objects.create()
        url = job.get_api_patch_inputs()

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
        url = job.get_api_patch_inputs()

        payload = {
            "editKey": job.password,
            "data": {"bmds_version": "BMDS312", "dataset_type": "C"},
        }
        response = client.patch(url, payload, format="json",)
        assert response.status_code == 400
        assert response.json() == ["'datasets' is a required property"]

        payload = {
            "editKey": job.password,
            "data": {"bmds_version": "BMDS312", "dataset_type": "C"},
            "partial": True,
        }
        response = client.patch(url, payload, format="json",)
        assert response.status_code == 200
        assert response.json()["inputs"] == payload["data"]

        payload["data"] = {
            "bmds_version": "BMDS312",
            "dataset_type": "C",
            "models": {"frequentist_restricted": ["ZZZ"]},
        }
        response = client.patch(url, payload, format="json",)
        assert response.status_code == 400
        assert response.json() == [
            "Model error(s): 'ZZZ' is not one of ['Exponential', 'Hill', 'Polynomial', 'Power']"
        ]

        payload["data"] = {
            "bmds_version": "BMDS312",
            "dataset_type": "C",
            "models": {"frequentist_restricted": ["Power"]},
        }
        response = client.patch(url, payload, format="json",)
        assert response.status_code == 200
        assert response.json()["inputs"] == payload["data"]

    def test_complete(self, bmds3_complete_continuous, bmds3_complete_dichotomous):
        client = APIClient()
        job = Job.objects.create()
        url = job.get_api_patch_inputs()

        # complete bmds3 continuous
        payload = {
            "editKey": job.password,
            "data": bmds3_complete_continuous,
        }

        response = client.patch(url, payload, format="json")
        assert response.status_code == 200
        assert response.json()["inputs"] == payload["data"]

        # complete bmds3 dichotomous
        payload = {
            "editKey": job.password,
            "data": bmds3_complete_dichotomous,
        }

        response = client.patch(url, payload, format="json")
        assert response.status_code == 200
        assert response.json()["inputs"] == payload["data"]
