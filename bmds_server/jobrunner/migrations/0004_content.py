from django.conf import settings
from django.core.management import call_command
from django.db import migrations, models


def load_fixture(apps, schema_editor):
    filename = settings.BASE_DIR / "jobrunner/fixtures/initial_data.json"
    call_command("loaddata", str(filename), app_label="jobrunner")


class Migration(migrations.Migration):

    dependencies = [
        ("jobrunner", "0003_deletion_date"),
    ]

    operations = [
        migrations.CreateModel(
            name="Content",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                (
                    "content_type",
                    models.PositiveIntegerField(choices=[(1, "Homepage")], unique=True),
                ),
                ("subject", models.CharField(max_length=128)),
                ("content", models.JSONField()),
                ("created", models.DateTimeField(auto_now_add=True)),
                ("last_updated", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ("-created",)},
        ),
        migrations.RunPython(load_fixture, reverse_code=migrations.RunPython.noop),
    ]
