from django.core.management import call_command
from django.db import migrations


def make_revisions(apps, schema_editor):
    call_command("createinitialrevisions")


def remove_revisions(apps, schema_editor):
    call_command("deleterevisions")


class Migration(migrations.Migration):

    dependencies = [
        ("analysis", "0002_fixtures"),
        ("reversion", "0001_squashed_0004_auto_20160611_1202"),
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.RunPython(make_revisions, remove_revisions),
    ]
