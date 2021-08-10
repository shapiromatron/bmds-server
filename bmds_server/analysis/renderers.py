import json
from io import BytesIO, StringIO
from typing import Dict, NamedTuple, Union

import matplotlib.pyplot as plt
from matplotlib.axes import Axes
from rest_framework.renderers import BaseRenderer


class TxtRenderer(BaseRenderer):

    media_type = "text/plain"
    format = "txt"

    def render(self, text: str, accepted_media_type, renderer_context):
        return text


class BinaryFile(NamedTuple):
    data: BytesIO
    filename: str


class XlsxRenderer(BaseRenderer):
    media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    format = "xlsx"

    def render(self, dataset: Union[Dict, BinaryFile], media_type=None, renderer_context=None):
        if isinstance(dataset, dict):
            return json.dumps(dataset).encode()

        response = renderer_context["response"]
        response["Content-Disposition"] = f'attachment; filename="{dataset.filename}.xlsx"'
        return dataset.data.getvalue()


class DocxRenderer(BaseRenderer):
    media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    format = "docx"

    def render(self, dataset: Union[Dict, BinaryFile], media_type=None, renderer_context=None):
        if isinstance(dataset, dict):
            return json.dumps(dataset).encode()

        response = renderer_context["response"]
        response["Content-Disposition"] = f'attachment; filename="{dataset.filename}.docx"'
        return dataset.data.getvalue()


class SvgRenderer(BaseRenderer):
    media_type = "image/svg+xml"
    format = "svg"

    def render(self, ax: Axes, accepted_media_type=None, renderer_context=None):
        if isinstance(ax, dict):
            return f"<svg><text>{json.dumps(ax)}</text></svg>"
        f = StringIO()
        ax.figure.savefig(f, format="svg")
        plt.close(ax.figure)
        return f.getvalue()
