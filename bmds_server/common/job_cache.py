from enum import IntEnum
from typing import Any, Optional

from django.conf import settings
from django.core.cache import caches
from pydantic import BaseModel


class ReportStatus(IntEnum):
    QUEUED = 1
    COMPLETE = 2


class ReportResponse(BaseModel):
    status: ReportStatus
    content: Optional[Any]
    header: Optional[str]
    message: Optional[str]


class ReportCache:
    """
    A cache designed for long-running report jobs.
    """

    cache_prefix: str = ""
    status = ReportStatus

    def __init__(self, job):
        self.cache = caches[settings.DISK_CACHE_NAME]
        self.job = job

    @property
    def cache_key(self):
        return f"{self.cache_prefix}-{self.job.id}"

    def invoke_celery_task(self) -> None:
        """
        Invoke celery task to invoke which does the work in the create method.

        Returns None.
        """
        raise NotImplementedError("Subclass requires implementation")

    def create(self) -> Any:
        """
        The expensive method which does all the work.

        Raises:
            NotImplementedError: [description]

        Returns:
            Any: [description]
        """
        # The slow, expensive method that does the work. Returns the object to cache/return
        raise NotImplementedError("Subclass requires implementation")

    def request_content(self) -> ReportResponse:
        # method used to try to get content if it exists, or schedule a task to create if it doesnt

        # try to get content
        key = self.cache_key
        response = self.cache.get(key)
        if response:
            return response

        # nothing done yet, request!
        response = ReportResponse(
            status=ReportStatus.QUEUED,
            content=None,
            header="Report being created",
            message="Report requested... please wait until results are complete.",
        )
        self.cache.set(key, response, 60 * 5)  # re-request after 5 minutes
        self.invoke_celery_task()
        return response

    def create_content(self):
        # method used to create content; generally an async task on worker queue
        key = self.cache_key
        content = self.create()
        response = ReportResponse(
            status=ReportStatus.COMPLETE, content=content, header=None, message=None,
        )
        self.cache.set(key, response)
