from django.contrib import admin
from django.core.cache import cache
from django.utils.html import format_html

from . import models, tasks


@admin.register(models.Job)
class JobAdmin(admin.ModelAdmin):
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

    def diagnostic_celery_task(modeladmin, request, queryset):
        response = tasks.diagnostic_celery_task.delay(request.user.id).get()
        message = f"Celery task executed successfully: {response}"
        modeladmin.message_user(request, message)

    diagnostic_celery_task.short_description = "Diagnostic celery task test"

    def diagnostic_cache(modeladmin, request, queryset):
        cache.set("foo", "bar")
        assert cache.get("foo") == "bar"
        assert cache.delete("foo") == 1
        assert cache.get("foo") is None
        message = "Cache test executed successfully"
        modeladmin.message_user(request, message)

    diagnostic_cache.short_description = "Diagnostic cache test"

    actions = (diagnostic_celery_task, diagnostic_cache)
