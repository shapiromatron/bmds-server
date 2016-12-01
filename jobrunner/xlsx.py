import xlsxwriter
from io import BytesIO


class XLSXGenerator(object):

    def __init__(self, content):
        self.content = content

    def _setup_wb(self):
        self.f = BytesIO()
        self.workbook = xlsxwriter.Workbook(self.f)

    def _get_fn(self):
        return 'hi.xlsx'

    def _return_wb_content(self):
        self.workbook.close()
        content = self.f.getvalue()
        self.f.close()
        return content

    def get_xlsx(self):
        # Return filename and bytes content from workbook
        self._setup_wb()
        return self._get_fn(), self._return_wb_content()
