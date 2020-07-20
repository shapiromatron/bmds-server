from rest_framework.renderers import BaseRenderer


class TxtRenderer(BaseRenderer):

    media_type = "text/plain"
    format = "txt"

    def render(self, txt, accepted_media_type, renderer_context):
        return txt


class XlsxRenderer(BaseRenderer):
    media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    format = "xlsx"

    def render(self, wb, media_type=None, renderer_context=None):
        return wb
        
class docxRenderer(BaseRenderer):
    media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    format = "docx"

    def render(self, wb, media_type=None, renderer_context=None):
        return wb