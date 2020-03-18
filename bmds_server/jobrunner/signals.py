import json

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from . import models, tasks


@receiver(post_save, sender=models.Job)
def start_job(sender, instance, created, **kwargs):
    if created:
        id_ = str(instance.id)
        inputs = json.loads(instance.inputs)
        immediate = inputs.get("immediate", False)
        if immediate and settings.ALLOW_BLOCKING_BMDS_REQUESTS:
            instance.try_execute()
        else:
            tasks.try_execute.delay(id_)
