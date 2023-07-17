import pytest
from django.http.response import Http404
from django.test import Client
from django.urls import reverse
from django.utils.timezone import now
from pytest_django.asserts import assertTemplateNotUsed, assertTemplateUsed

from bmds_server.analysis.models import Analysis
from bmds_server.analysis.views import Analytics, get_analysis_or_404


@pytest.mark.django_db
def test_get_analysis_or_404():
    pk = "cc3ca355-a57a-4fba-9dc3-99657562df68"
    analysis = Analysis.objects.get(pk=pk)
    bad_pk = "ec1af18c-e4e8-4e81-9a53-5b72a320eb52"
    # success
    assert get_analysis_or_404(pk) == (analysis, False)
    assert get_analysis_or_404(pk, analysis.password) == (analysis, True)
    # failures
    with pytest.raises(Http404):
        get_analysis_or_404(bad_pk)  # bad pk
    with pytest.raises(Http404):
        get_analysis_or_404(pk, "invalid")  # good pk; bad password
    with pytest.raises(Http404):
        get_analysis_or_404(bad_pk, "invalid")  # bad pk; bad password


@pytest.mark.django_db
class TestAnalysisDetail:
    def test_context(self):
        client = Client()
        pk = "cc3ca355-a57a-4fba-9dc3-99657562df68"
        analysis = Analysis.objects.get(pk=pk)
        pw = analysis.password

        # read view should have no edit settings context
        response = client.get(analysis.get_absolute_url())
        assert response.context["config"] == {
            "apiUrl": f"/api/v1/analysis/{pk}/",
            "url": f"/analysis/{pk}/",
            "excelUrl": f"/api/v1/analysis/{pk}/excel/",
            "wordUrl": f"/api/v1/analysis/{pk}/word/",
            "future": True,
            "is_desktop": False,
        }

        # write view should have edit context
        response = client.get(analysis.get_edit_url())
        config = response.context["config"]
        config["editSettings"].pop("csrfToken")
        assert isinstance(config["editSettings"].pop("deletionDaysUntilDeletion"), int)
        assert config == {
            "apiUrl": f"/api/v1/analysis/{pk}/",
            "url": f"/analysis/{pk}/",
            "excelUrl": f"/api/v1/analysis/{pk}/excel/",
            "wordUrl": f"/api/v1/analysis/{pk}/word/",
            "future": True,
            "is_desktop": False,
            "editSettings": {
                "editKey": pw,
                "viewUrl": f"http://testserver/analysis/{pk}/",
                "editUrl": f"http://testserver/analysis/{pk}/{pw}/",
                "patchInputUrl": f"/api/v1/analysis/{pk}/patch-inputs/",
                "renewUrl": f"http://testserver/analysis/{pk}/{pw}/renew/",
                "deleteUrl": f"http://testserver/analysis/{pk}/{pw}/delete/",
                "executeUrl": f"/api/v1/analysis/{pk}/execute/",
                "executeResetUrl": f"/api/v1/analysis/{pk}/execute-reset/",
                "deleteDateStr": "June 14, 2022",
            },
        }

    def test_future(self):
        client = Client()
        pk = "cc3ca355-a57a-4fba-9dc3-99657562df68"
        analysis = Analysis.objects.get(pk=pk)
        url = analysis.get_absolute_url() + "?future=1"

        # no staff access; recently changed to all access for future
        response = client.get(url)
        assert response.context["config"]["future"] is True

        # staff access; future flag
        assert client.login(username="admin@bmdsonline.org", password="pw")
        response = client.get(url)
        assert response.context["config"]["future"] is True


@pytest.mark.django_db
class TestAnalysisRenew:
    def test_success(self):
        client = Client()
        pk = "cc3ca355-a57a-4fba-9dc3-99657562df68"
        analysis = Analysis.objects.get(pk=pk)
        url = analysis.get_renew_url()
        right_now = now()

        # deletion date is now
        analysis.deletion_date = right_now
        analysis.save()
        assert analysis.deletion_date == right_now

        response = client.get(url)
        assert response.status_code == 302
        assert response.url == analysis.get_edit_url()

        # deletion date is now in the future
        analysis.refresh_from_db()
        assert analysis.deletion_date > right_now


@pytest.mark.django_db
class TestAnalytics:
    def test_view(self):
        # test that permissions work and view loads
        url = reverse("analytics")
        template = Analytics.template_name

        client = Client()
        resp = client.get(url)
        assert resp.status_code == 302 and "/login/" in resp.url
        assertTemplateNotUsed(resp, template)

        assert client.login(username="admin@bmdsonline.org", password="pw") is True
        resp = client.get(url)
        assert resp.status_code == 200
        assertTemplateUsed(resp, template)
