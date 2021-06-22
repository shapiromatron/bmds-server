import json

import pytest
from django.http.response import Http404
from django.test import Client
from django.utils.timezone import now

from bmds_server.analysis.models import Analysis
from bmds_server.analysis.views import get_analysis_or_404


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
        assert json.loads(response.context["config"]) == {
            "apiUrl": f"/api/v1/analysis/{pk}/",
            "url": f"/analysis/{pk}/",
            "excelUrl": f"/api/v1/analysis/{pk}/excel/",
            "wordUrl": f"/api/v1/analysis/{pk}/word/",
        }

        # write view should have edit context
        response = client.get(analysis.get_edit_url())
        config = json.loads(response.context["config"])
        config["editSettings"].pop("csrfToken")
        assert isinstance(config["editSettings"].pop("deletionDaysUntilDeletion"), int)
        assert config == {
            "apiUrl": f"/api/v1/analysis/{pk}/",
            "url": f"/analysis/{pk}/",
            "excelUrl": f"/api/v1/analysis/{pk}/excel/",
            "wordUrl": f"/api/v1/analysis/{pk}/word/",
            "editSettings": {
                "editKey": pw,
                "viewUrl": f"http://testserver/analysis/{pk}/",
                "editUrl": f"http://testserver/analysis/{pk}/{pw}/",
                "patchInputUrl": f"/api/v1/analysis/{pk}/patch-inputs/",
                "renewUrl": f"http://testserver/analysis/{pk}/{pw}/renew/",
                "deleteUrl": f"http://testserver/analysis/{pk}/{pw}/delete/",
                "executeUrl": f"/api/v1/analysis/{pk}/execute/",
                "executeResetUrl": f"/api/v1/analysis/{pk}/execute-reset/",
                "deleteDateStr": "December 15, 2021",
            },
        }


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
