from django.contrib import admin
from django.utils.html import format_html

from . import models


@admin.register(models.Analysis)
class AnalysisAdmin(admin.ModelAdmin):
    list_display = ("__str__", "view_url", "edit_url", "created", "is_finished", "deletion_date")
    readonly_fields = ("password",)
    list_filter = (
        "started",
        "ended",
        "deletion_date",
    )

    def view_url(self, obj):
        return format_html(f"<a href='{obj.get_absolute_url()}'>View</a>")

    view_url.short_description = "View"

    def edit_url(self, obj):
        return format_html(f"<a href='{obj.get_edit_url()}'>Edit</a>")

    edit_url.short_description = "Edit"


@admin.register(models.Content)
class Content(admin.ModelAdmin):
    list_display = ("id", "content_type", "subject", "created", "last_updated")
    list_filter = ("content_type",)
