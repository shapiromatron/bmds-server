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
        assert response.json() == payload["data"]

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
        assert response.json() == payload["data"]

    def test_complete(self):
        client = APIClient()
        job = Job.objects.create()
        url = job.get_api_patch_inputs()

        payload = {
            "editKey": job.password,
            "data": {
                "bmds_version": "BMDS312",
                "dataset_type": "C",
                "models": {"frequentist_restricted": ["Power"]},
                "datasets": [
                    {
                        "id": 123,
                        "doses": [0, 10, 50, 150, 400],
                        "ns": [111, 142, 143, 93, 42],
                        "means": [2.112, 2.095, 1.956, 1.587, 1.254],
                        "stdevs": [0.235, 0.209, 0.231, 0.263, 0.159],
                    }
                ],
                "options": [
                    {
                        "bmr_type": "Std. Dev.",
                        "bmr_value": 1.0,
                        "tail_probability": 0.95,
                        "confidence_level": 0.05,
                        "distribution": "Normal",
                        "variance": "Calculated",
                        "polynomial_restriction": "Use dataset adverse direction",
                        "background": "Estimated",
                    }
                ],
            },
        }

        response = client.patch(url, payload, format="json")
        assert response.status_code == 200
        assert response.json() == payload["data"]
