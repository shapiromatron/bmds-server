from io import BytesIO

from ..common.job_cache import ReportCache
from . import tasks


class ExcelReportCache(ReportCache):
    cache_prefix = "excel"

    def invoke_celery_task(self):
        return tasks.generate_excel.delay(str(self.job.id))

    def create(self) -> BytesIO:
        return self.job.to_excel()


class DocxReportCache(ReportCache):
    cache_prefix = "docx"

    def invoke_celery_task(self):
        return tasks.generate_report.delay(str(self.job.id))

    def create(self) -> BytesIO:
        return self.job.to_word()
