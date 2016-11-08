from django.db.models.signals import post_save
from django.dispatch import receiver

from . import tasks, models


@receiver(post_save, sender=models.Job)
def start_job(sender, instance, created, **kwargs):
    if created:
        id_ = str(instance.id)
        tasks.execute.delay(id_)
