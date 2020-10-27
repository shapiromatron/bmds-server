from django.contrib import admin
from django.core.cache import cache

from . import models, tasks


@admin.register(models.Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ("id", "password", "created", "started", "ended", "is_finished")
    readonly_fields = ("password",)

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
