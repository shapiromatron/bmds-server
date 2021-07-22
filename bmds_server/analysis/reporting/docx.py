from __future__ import annotations

from io import BytesIO
from typing import TYPE_CHECKING

import docx
from bmds.reporting.styling import Report
from django.conf import settings
from django.utils.timezone import now

from ...common.utils import to_timestamp
from ...common.docx import add_url_hyperlink

if TYPE_CHECKING:
    from ..models import Analysis

ANALYSIS_URL = "Analysis URL: "


def build_docx(analysis: Analysis, uri: str) -> BytesIO:
    f = BytesIO()
    report = Report.build_default()

    report.document.add_heading(analysis.name(), 1)

    description = analysis.inputs.get("analysis_description")
    if description:
        report.document.add_paragraph(description)

    p = report.document.add_paragraph()
    p.add_run("Report generated: ").bold = True
    p.add_run(to_timestamp(now()))

    p = report.document.add_paragraph()
    p.add_run(ANALYSIS_URL).bold = True
    uri += analysis.get_absolute_url()
    add_url_hyperlink(p, uri, "View")

    p = report.document.add_paragraph()
    p.add_run("BMDS version: ").bold = True
    p.add_run(analysis.inputs["bmds_version"] + "α2")  # TODO - change when live

    p = report.document.add_paragraph()
    p.add_run("BMDS online version: ").bold = True
    p.add_run(str(settings.COMMIT))

    if not analysis.is_finished:
        report.document.add_paragraph("Execution is incomplete; no report could be generated")
    elif analysis.has_errors:
        report.document.add_paragraph("Execution generated errors; no report can be generated")
    else:
        batch = analysis.to_batch()
        batch.to_docx(report=report)

    report.document.save(f)
    return f


def add_update_url(analysis: Analysis, data: BytesIO, uri: str) -> BytesIO:
    document = docx.Document(data)
    for p in document.paragraphs:
        if p.text.startswith(ANALYSIS_URL):
            p.add_run(" / ")
            uri += analysis.get_edit_url()
            add_url_hyperlink(p, uri, "Update")
            break

    f = BytesIO()
    document.save(f)
    return f
