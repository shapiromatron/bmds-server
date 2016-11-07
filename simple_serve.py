import os
from wsgiref.simple_server import make_server

from bmds_server.wsgi import application

port = os.environ.get('HTTP_PLATFORM_PORT', 5555)
httpd = make_server('', port, application)
httpd.serve_forever()
