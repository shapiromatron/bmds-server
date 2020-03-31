from django.contrib import admin

from . import models


class JobAdmin(admin.ModelAdmin):
    list_display = ("id", "password", "created", "started", "ended", "is_finished")
    readonly_fields = ("password",)


admin.site.register(models.Job, JobAdmin)
