import json

import pytest
from django.test import Client

from bmds_server.jobrunner.models import Job


@pytest.mark.django_db
class TestJobDetail:
    def test_context(self):
        client = Client()
        job = Job.objects.get(pk="cc3ca355-a57a-4fba-9dc3-99657562df68")

        # read view should have no edit settings context
        response = client.get(job.get_absolute_url())
        assert json.loads(response.context["config"]) == {
            "apiUrl": "/api/v1/job/cc3ca355-a57a-4fba-9dc3-99657562df68/",
            "url": "/job/cc3ca355-a57a-4fba-9dc3-99657562df68/",
            "excelUrl": "/api/v1/job/cc3ca355-a57a-4fba-9dc3-99657562df68/excel/",
            "wordUrl": "/api/v1/job/cc3ca355-a57a-4fba-9dc3-99657562df68/word/",
        }

        # write view should have edit context
        response = client.get(job.get_edit_url())
        config = json.loads(response.context["config"])
        config["editSettings"].pop("csrfToken")
        assert config == {
            "apiUrl": "/api/v1/job/cc3ca355-a57a-4fba-9dc3-99657562df68/",
            "url": "/job/cc3ca355-a57a-4fba-9dc3-99657562df68/",
            "excelUrl": "/api/v1/job/cc3ca355-a57a-4fba-9dc3-99657562df68/excel/",
            "wordUrl": "/api/v1/job/cc3ca355-a57a-4fba-9dc3-99657562df68/word/",
            "editSettings": {
                "editKey": "641515anrub7",
                "viewUrl": "http://testserver/job/cc3ca355-a57a-4fba-9dc3-99657562df68/",
                "editUrl": "http://testserver/job/cc3ca355-a57a-4fba-9dc3-99657562df68/641515anrub7/",  # noqa: E501
                "patchInputUrl": "/api/v1/job/cc3ca355-a57a-4fba-9dc3-99657562df68/patch-inputs/",
                "executeUrl": "/api/v1/job/cc3ca355-a57a-4fba-9dc3-99657562df68/execute/",
                "deleteDateStr": "2020-Dec-22",
                "allowDatasetEditing": True,
                "allowBmdsVersionEditing": True,
            },
        }
