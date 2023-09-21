import logging
import os
from contextlib import redirect_stderr, redirect_stdout
from importlib.metadata import version
from io import StringIO
from pathlib import Path
from threading import Thread
from time import sleep
from webbrowser import open_new_tab

import cherrypy
from django.core.management import execute_from_command_line
from pydantic import BaseModel, Field
from textual import on
from textual.app import App, ComposeResult
from textual.containers import Container, ScrollableContainer
from textual.widgets import (
    Button,
    Footer,
    Header,
    Label,
    Markdown,
    Static,
    TabbedContent,
    TabPane,
    TextLog,
)
from whitenoise import WhiteNoise

logger = logging.getLogger(__name__)

ROOT = Path(__file__).parent


def data_folder() -> Path:
    home = Path.home()
    if home.is_dir() and home.exists():
        if home.joinpath(".local", "share").exists():
            local_dir = home.joinpath(".local", "share")
        else:
            local_dir = home.joinpath("AppData", "Local")
    else:
        raise ValueError("Unsupported platform")

    path = local_dir / "bmds-desktop"
    path.mkdir(parents=True, exist_ok=True)
    return path


class DesktopConfig(BaseModel):
    path: str = Field(default_factory=lambda: str(data_folder()))
    port: int = 5555
    host: str = "127.0.0.1"


class LogApp:
    def __init__(self, app):
        self.stream = StringIO()
        self.handler = logging.StreamHandler(self.stream)
        self.widget = TextLog(id="log")
        self.thread = Thread(target=self._run, daemon=True)

    def add_handler(self):
        logger = logging.getLogger()
        logger.addHandler(self.handler)
        logger.setLevel(logging.INFO)

    def start(self):
        self.add_handler()
        self.thread.start()

    def _run(self):
        while True:
            if log_contents := self.stream.getvalue().strip():
                self.widget.write(log_contents)
                self.stream.seek(0)
                self.stream.truncate()
            sleep(1)


def run_django_command(command: str):
    execute_from_command_line(command.split(" "))


class AppThread(Thread):
    def __init__(self, stream: StringIO, host="127.0.0.1", port=5000, **kw):
        self.stream = stream
        self.host = host
        self.port = port
        super().__init__(**kw)

    def run(self):
        from django.conf import settings

        with redirect_stdout(self.stream), redirect_stderr(self.stream):
            from ..main.wsgi import application as django_app

            run_django_command("manage.py migrate --noinput")
            run_django_command("manage.py collectstatic --noinput")

            application = WhiteNoise(django_app, root=settings.PUBLIC_DATA_ROOT)
            cherrypy.config.update(
                {"server.socket_host": self.host, "server.socket_port": self.port}
            )
            cherrypy.tree.graft(application, "/")
            cherrypy.server.start()
            cherrypy.engine.block()

    def stop(self):
        cherrypy.engine.exit()


class AppRunner:
    LABEL = {True: "Stop BMDS Desktop", False: "Start BMDS Desktop"}

    def __init__(self, app: "BmdsDesktop"):
        self.app = app
        self.started = False
        self.widget = Button(label=self.LABEL[self.started], id="runner-button", variant="primary")
        self.thread: AppThread | None = None

    def toggle(self):
        host = self.app.config.host
        port = self.app.config.port
        self.started = not self.started
        self.widget.label = self.LABEL[self.started]
        if self.started:
            # todo - make an init function
            # it should create db and migrate and load home.html
            # it should collect staticfiles to user_data folder
            # os.environ["bmds_db_path"] = self.app.config.path
            self.thread = AppThread(
                stream=self.app.log_app.stream,
                host=host,
                port=port,
                daemon=True,
            )
            self.thread.start()
            sleep(1)
            open_new_tab(f"http://{host}:{port}")
        else:
            if self.thread:
                self.thread.stop()
                self.thread = None

    def start(self):
        self.thread.start()


class BmdsTabs(Static):
    def __init__(self, _app: "BmdsDesktop", **kw):
        self._app = _app
        super().__init__(**kw)

    def compose(self) -> ComposeResult:
        with TabbedContent(id="tabs"):
            with TabPane("Application", classes="app"):
                yield Container(
                    self._app.runner.widget,
                )
                yield Container(
                    Label(f"[b]Data folder:[/b]\n  {self._app.config.path}"),
                    Label(f"[b]Port:[/b]\n  {self._app.config.port}"),
                    Label(f"[b]Host:[/b]\n  {self._app.config.host}"),
                    classes="app-box",
                )

            with TabPane("Logging"):
                yield self._app.log_app.widget


class BmdsDesktop(App):
    """A Textual app for BMDS."""

    TITLE = f"BMDS Desktop (version {version('bmds_server')})"
    BINDINGS = [("q", "quit", "Quit"), ("d", "toggle_dark", "Toggle dark mode")]
    CSS_PATH = "content/app.css"

    def __init__(self, **kw):
        self.config = DesktopConfig()
        self.log_app = LogApp(self)
        self.runner = AppRunner(self)
        self.tabs = BmdsTabs(self)
        super().__init__(**kw)

    def compose(self) -> ComposeResult:
        """Create child widgets for the app."""
        yield Header()
        yield ScrollableContainer(
            Markdown((ROOT / "content/top.md").read_text()), self.tabs, classes="main"
        )
        yield Footer()

    @on(Button.Pressed, "#runner-button")
    def toggle_runner(self):
        self.runner.toggle()

    def action_quit(self):
        """Exit the application."""
        self.exit()

    def action_toggle_dark(self):
        """An action to toggle dark mode."""
        self.dark = not self.dark

    def on_mount(self) -> None:
        self.log_app.start()


def main():
    os.environ["DJANGO_SETTINGS_MODULE"] = "bmds_server.main.settings.desktop"
    app = BmdsDesktop()
    app.run()
