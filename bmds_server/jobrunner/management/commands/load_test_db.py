from textwrap import dedent

from django.conf import settings
from django.core.management import call_command
from django.core.management.base import BaseCommand, CommandError

HELP_TEXT = """Load the test database from a fixture."""


class Command(BaseCommand):
    help = HELP_TEXT

    def add_arguments(self, parser):
        parser.add_argument(
            "--noinput",
            action="store_false",
            dest="interactive",
            help="Do NOT prompt the user for input of any kind.",
        )

    def handle(self, *args, **options):

        if options["interactive"]:
            db_name = settings.DATABASES["default"]["NAME"]
            message = dedent(
                f"""
                Loading test database into {db_name}. Are you sure you want to do this? This will
                overwrite the existing database.

                Type 'yes' to continue, or 'no' to cancel:
                """
            )
            if input("".join(message)) != "yes":
                raise CommandError("Loading test database cancelled.")

        call_command("migrate", verbosity=0)
        call_command("flush", verbosity=0, interactive=False)
        call_command("loaddata", str(settings.TEST_DB_FIXTURE), verbosity=1)
