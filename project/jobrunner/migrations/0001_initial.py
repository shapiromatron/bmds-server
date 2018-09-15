# -*- coding: utf-8 -*-
import uuid

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Job",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("inputs", models.TextField()),
                ("outputs", models.TextField(blank=True)),
                ("errors", models.TextField(blank=True)),
                ("created", models.DateTimeField(auto_now_add=True)),
                ("started", models.DateTimeField(null=True)),
                ("ended", models.DateTimeField(null=True)),
            ],
        )
    ]
