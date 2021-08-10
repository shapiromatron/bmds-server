from django.contrib import admin
from django.contrib.admin import SimpleListFilter
from django.db.models import TextChoices
from django.utils.html import format_html

from . import models


class CustomQuerysetsFilter(SimpleListFilter):
    title = "custom"
    parameter_name = "custom"

    class CustomQuerysetChoices(TextChoices):
        MAYBE_HANGING = "hanging"

    def lookups(self, request, model_admin):
        return self.CustomQuerysetChoices.choices

    def queryset(self, request, queryset):
        value = self.value()
        if value == self.CustomQuerysetChoices.MAYBE_HANGING:
            return models.Analysis.maybe_hanging(queryset)


@admin.register(models.Analysis)
class AnalysisAdmin(admin.ModelAdmin):
    list_display = ("__str__", "view_url", "edit_url", "created", "is_finished", "deletion_date")
    readonly_fields = ("password",)
    list_filter = (
        CustomQuerysetsFilter,
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
