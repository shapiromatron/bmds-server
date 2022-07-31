import pytest
from django.urls import reverse
from rest_framework.test import APIClient


@pytest.mark.django_db
class TestOpenApiSchema:
    def test_schema(self):
        anon = APIClient()
        admin = APIClient()
        admin.login(username="admin@bmdsonline.org", password="pw")

        url = reverse("openapi")

        # admin required
        assert anon.get(url).status_code == 401

        # with admin, success
        resp = admin.get(url)
        assert resp.status_code == 200
        assert "openapi" in resp.data


@pytest.mark.django_db
class TestHealthcheckViewset:
    def test_web(self):
        anon = APIClient()
        admin = APIClient()
        admin.login(username="admin@bmdsonline.org", password="pw")

        url = reverse("api:healthcheck-web")
        resp = anon.get(url)
        assert resp.status_code == 200
        assert resp.json() == {"healthy": True}

    def test_throttle(self):
        anon = APIClient()
        admin = APIClient()
        admin.login(username="admin@bmdsonline.org", password="pw")

        # failure - not admin
        url = reverse("api:healthcheck-throttle")
        resp = anon.get(url)
        assert resp.status_code == 401

        # success - admin
        url = reverse("api:healthcheck-throttle")
        for i in range(5):
            resp = admin.get(url)
            assert resp.status_code == 200
            assert "identity" in resp.data

        # success- throttled (>5/min)
        resp = admin.get(url)
        assert resp.status_code == 429
