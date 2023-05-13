import logging
from datetime import datetime
from importlib.metadata import version
from io import StringIO
from pathlib import Path
from threading import Event, Thread
from time import sleep
from webbrowser import open_new_tab

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


class LogApp:
    def __init__(self):
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


class AppThread(Thread):
    def __init__(self, **kw):
        super().__init__(**kw)
        self._stop_event = Event()

    def run(self):
        while not self._stop_event.is_set():
            logger.info(f"Thread running at {datetime.now()}")
            sleep(1)
        logger.info(f"Thread stopped at {datetime.now()}")

    def stop(self):
        self._stop_event.set()


class AppRunner:
    LABEL = {True: "Stop BMDS Desktop", False: "Start BMDS Desktop"}

    def __init__(self):
        self.started = False
        self.widget = Button(label=self.LABEL[self.started], id="runner-button", variant="primary")
        self.thread: AppThread

    def toggle(self):
        self.started = not self.started
        self.widget.label = self.LABEL[self.started]
        if self.started:
            self.thread = AppThread(daemon=True)
            self.thread.start()
            sleep(1)
            open_new_tab("http://127.0.0.1:8100")
        else:
            self.thread.stop()
            self.thread = AppThread(daemon=True)

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
                    Label(f"[b]Data folder: [/b]\n  {data_folder()}"),
                    classes="app-box",
                )
            with TabPane("Logging"):
                yield self._app.log_app.widget


class BmdsDesktop(App):
    """A Textual app for BMDS."""

    TITLE = f"BMDS Desktop (version {version('bmds_server')})"
    BINDINGS = [("q", "quit", "Quit"), ("d", "toggle_dark", "Toggle dark mode")]
    CSS_PATH = "app.css"

    def __init__(self, **kw):
        self.log_app = LogApp()
        self.runner = AppRunner()
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
    app = BmdsDesktop()
    app.run()
