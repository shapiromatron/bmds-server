import json

import pytest
from django.test import Client
from django.utils.timezone import now

from bmds_server.analysis.models import Analysis


@pytest.mark.django_db
class TestAnalysisDetail:
    def test_context(self):
        client = Client()
        analysis = Analysis.objects.get(pk="cc3ca355-a57a-4fba-9dc3-99657562df68")

        # read view should have no edit settings context
        response = client.get(analysis.get_absolute_url())
        assert json.loads(response.context["config"]) == {
            "apiUrl": "/api/v1/analysis/cc3ca355-a57a-4fba-9dc3-99657562df68/",
            "url": "/analysis/cc3ca355-a57a-4fba-9dc3-99657562df68/",
            "excelUrl": "/api/v1/analysis/cc3ca355-a57a-4fba-9dc3-99657562df68/excel/",
            "wordUrl": "/api/v1/analysis/cc3ca355-a57a-4fba-9dc3-99657562df68/word/",
        }

        # write view should have edit context
        response = client.get(analysis.get_edit_url())
        config = json.loads(response.context["config"])
        config["editSettings"].pop("csrfToken")
        assert isinstance(config["editSettings"].pop("deletionDaysUntilDeletion"), int)
        assert config == {
            "apiUrl": "/api/v1/analysis/cc3ca355-a57a-4fba-9dc3-99657562df68/",
            "url": "/analysis/cc3ca355-a57a-4fba-9dc3-99657562df68/",
            "excelUrl": "/api/v1/analysis/cc3ca355-a57a-4fba-9dc3-99657562df68/excel/",
            "wordUrl": "/api/v1/analysis/cc3ca355-a57a-4fba-9dc3-99657562df68/word/",
            "editSettings": {
                "editKey": "641515anrub7",
                "viewUrl": "http://testserver/analysis/cc3ca355-a57a-4fba-9dc3-99657562df68/",
                "editUrl": "http://testserver/analysis/cc3ca355-a57a-4fba-9dc3-99657562df68/641515anrub7/",  # noqa: E501
                "patchInputUrl": "/api/v1/analysis/cc3ca355-a57a-4fba-9dc3-99657562df68/patch-inputs/",  # noqa: E501
                "renewUrl": "http://testserver/analysis/cc3ca355-a57a-4fba-9dc3-99657562df68/641515anrub7/renew/",  # noqa: E501
                "executeUrl": "/api/v1/analysis/cc3ca355-a57a-4fba-9dc3-99657562df68/execute/",
                "executeResetUrl": "/api/v1/analysis/cc3ca355-a57a-4fba-9dc3-99657562df68/execute-reset/",  # noqa: E501
                "deleteDateStr": "December 15, 2021",
            },
        }


@pytest.mark.django_db
class TestAnalysisRenew:
    def test_success(self):
        client = Client()
        analysis = Analysis.objects.get(pk="cc3ca355-a57a-4fba-9dc3-99657562df68")
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
