from django.contrib import admin

from . import models


class JobAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'created',
        'started',
        'ended',
        'is_finished',
    )


admin.site.register(models.Job, JobAdmin)
