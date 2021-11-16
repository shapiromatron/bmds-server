import pytest
from django.urls import reverse
from rest_framework.test import APIClient


@pytest.mark.django_db
class TestOpenapiSchema:
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
