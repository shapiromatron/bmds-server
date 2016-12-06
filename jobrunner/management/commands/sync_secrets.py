import json
import os
from django.core.management.base import BaseCommand

from django.conf import settings


HELP_TEXT = """Put environment variables in proper places"""


class Command(BaseCommand):

    help = HELP_TEXT

    def write_webconfig(self, secrets):
        txt = '\n'.join([
            '        <environmentVariable name="{0}" value="{1}" />'.format(k, v)
            for k, v in secrets.items()
        ])

        in_fn = os.path.join(settings.BASE_DIR, 'web.config.template')
        out_fn = os.path.join(settings.BASE_DIR, 'web.config')

        with open(in_fn, 'r') as f:
            inputs = f.read()

        inputs = inputs.replace(r'{{BASE_DIR}}', settings.BASE_DIR)
        inputs = inputs.replace('<!-- ENVPLACEHOLDER -->', txt)

        with open(out_fn, 'w') as f:
            f.write(inputs)

    def write_celery(self, secrets):
        txt = '\n'.join([
            "    os.environ['{0}'] = r'{1}'".format(k, v)
            for k, v in secrets.items()
        ])

        in_fn = os.path.join(settings.BASE_DIR, 'run_celery_winservice.template.py')
        out_fn = os.path.join(settings.BASE_DIR, 'run_celery_winservice.py')

        with open(in_fn, 'r') as f:
            inputs = f.read()

        inputs = inputs.replace('    pass  # ENVPLACEHOLDER', txt)

        with open(out_fn, 'w') as f:
            f.write(inputs)

    def write_celerybeat(self, secrets):
        txt = '\n'.join([
            "    os.environ['{0}'] = r'{1}'".format(k, v)
            for k, v in secrets.items()
        ])

        in_fn = os.path.join(settings.BASE_DIR, 'run_celerybeat_winservice.template.py')
        out_fn = os.path.join(settings.BASE_DIR, 'run_celerybeat_winservice.py')

        with open(in_fn, 'r') as f:
            inputs = f.read()

        inputs = inputs.replace('    pass  # ENVPLACEHOLDER', txt)

        with open(out_fn, 'w') as f:
            f.write(inputs)

    def write_activate_bat(self, secrets):
        txt = 'set "PATH=%VIRTUAL_ENV%\Scripts;%PATH%"\n\n'
        txt += '\n'.join([
            'set "{0}={1}"'.format(k, v)
            for k, v in secrets.items()
        ])
        txt += '\n\ncd {0}\n\n:END'.format(settings.BASE_DIR)

        in_fn = os.path.join(settings.BASE_DIR, 'venv', 'Scripts', 'activate.bat')
        out_fn = in_fn

        if not os.path.exists(in_fn):
            self.stdout.write('File not found (not created): {}\n'.format(in_fn))
            return

        with open(in_fn, 'r') as f:
            inputs = f.read()

        startidx = inputs.find('set "PATH=%VIRTUAL_ENV%\Scripts;%PATH%"')
        outputs = inputs[:startidx] + txt

        with open(out_fn, 'w') as f:
            f.write(outputs)

    def write_activate_ps(self, secrets):
        txt = '$env:PATH = "$env:VIRTUAL_ENV\Scripts;$env:PATH"\n\n'
        txt += '\n'.join([
            '$env:{0}="{1}"'.format(k, v)
            for k, v in secrets.items()
        ])

        in_fn = os.path.join(settings.BASE_DIR, 'venv', 'Scripts', 'Activate.ps1')
        out_fn = in_fn

        if not os.path.exists(in_fn):
            self.stdout.write('File not found (not created): {}\n'.format(in_fn))
            return

        with open(in_fn, 'r') as f:
            inputs = f.read()

        startidx = inputs.find('$env:PATH = "$env:VIRTUAL_ENV\Scripts;$env:PATH"')
        outputs = inputs[:startidx] + txt

        with open(out_fn, 'w') as f:
            f.write(outputs)

    def handle(self, *args, **options):
        secrets_fn = os.path.join(settings.BASE_DIR, 'secrets.json')
        with open(secrets_fn, 'r') as f:
            secrets = json.load(f)

        self.write_webconfig(secrets)
        self.write_celery(secrets)
        self.write_celerybeat(secrets)
        self.write_activate_bat(secrets)
        self.write_activate_ps(secrets)
