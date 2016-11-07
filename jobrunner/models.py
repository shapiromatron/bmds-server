import uuid
from django.db import models
from django.core.urlresolvers import reverse

from . import tasks


class Job(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False)
    inputs = models.TextField()
    outputs = models.TextField(
        blank=True)
    errors = models.TextField(
        blank=True)
    created = models.DateTimeField(
        auto_now_add=True)
    started = models.DateTimeField(
        null=True)
    ended = models.DateTimeField(
        null=True)

    def __str__(self):
        return str(self.id)

    def get_absolute_url(self):
        return reverse('job', args=(str(self.id), ))

    @property
    def is_finished(self):
        return len(self.outputs) > 0
