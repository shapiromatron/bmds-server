from datetime import timedelta
from django.apps import apps
from django.core.management.base import BaseCommand
from django.conf import settings
from django.utils.timezone import now


class Command(BaseCommand):

    help = "Delete old results which are older than N days."

    def handle(self, *args, **options):
        oldest_to_keep = now() - timedelta(days=settings.DAYS_TO_KEEP_JOBS)
        Job = apps.get_model("jobrunner", "Job")
        qs = Job.objects.filter(created__lt=oldest_to_keep)
        self.stdout.write(
            "Deleting {} jobs created before {}\n".format(
                qs.count(), oldest_to_keep.strftime("%c")
            )
        )
        qs.delete()
