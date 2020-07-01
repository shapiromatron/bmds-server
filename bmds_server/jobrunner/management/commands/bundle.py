import subprocess
from shlex import split

from django.conf import settings
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Build a deployment bundle container installation"

    def handle(self, *args, **options):
        # ins/outs for tar file
        filename = "./dist/bmds_server.tar.gz"
        (settings.ROOT_DIR / filename).parent.mkdir(parents=True, exist_ok=True)
        includes = ["bmds_server/", "setup.cfg", "setup.py", "webpack-stats.json"]
        excludes = ["__pycache__", "DS_Store", "bmds_server/settings/local.py"]

        # assembly commands
        _exclude_cmd = [f'--exclude="{el}"' for el in excludes]
        command = f"tar -czf {filename} {' '.join(_exclude_cmd)} {' '.join(includes)}"
        self.stdout.write(f"Calling: {command}")
        subprocess.call(split(command), cwd=str(settings.ROOT_DIR))
