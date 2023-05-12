import logging
from contextlib import redirect_stderr, redirect_stdout
from datetime import datetime
from importlib.metadata import version
from threading import Thread
from time import sleep

from textual.app import App, ComposeResult
from textual.containers import ScrollableContainer
from textual.widgets import Button, Footer, Header, Markdown, TextLog

from .web import MyServer

logger = logging.getLogger(__name__)

MD_HEADER = """## Welcome to BMDS Desktop.
Here's a bunch of header text we can add to describe what this is."""


class TextLogHandler(logging.Handler):
    def __init__(self, widget: TextLog):
        super().__init__()
        self.widget = widget
        self.widget.write("startup")
        logger.warning("test")

    def emit(self, record):
        self.widget.write(record)


class DjangoApp:
    def __init__(self, tui: "BmdsDesktop"):
        self.is_running = False
        self.tui = tui
        self.app_server = MyServer()

    def toggle_button(self, btn: Button):
        btn.label = "Start" if self.is_running else "Stop"
        self.is_running = not self.is_running
        if self.is_running:
            with redirect_stdout(logger.handlers[0]), redirect_stderr(log_stream):
                self.app_server.start()
        else:
            logger.info("Stopping...")
            self.app_server.stop()
            self.app_server = MyServer()


class LogApp:
    def __init__(self, tui: App):
        self.tui = tui

    def log(self, message: str):
        logger = self.tui.query_one("#log", expect_type=TextLog)
        logger.write(f"{datetime.now()}: {message}")


def add_logs(app):
    while True:
        logger.warning("abc")
        sleep(1)


class BmdsDesktop(App):
    """A Textual app for BMDS."""

    TITLE = f"BMDS Desktop (version {version('bmds_server')})"
    BINDINGS = [("q", "quit", "Quit"), ("d", "toggle_dark", "Toggle dark mode")]

    def __init__(self, **kw):
        self.django_app = DjangoApp(self)
        self.log_app = LogApp(self)
        super().__init__(**kw)
        self.text_log_widget = TextLog(id="log")
        self.text_log = TextLogHandler(widget=self.text_log_widget)
        logger.addHandler(self.text_log)

        logger_thread = Thread(target=add_logs, daemon=True, args=(self,))
        logger_thread.start()

    def compose(self) -> ComposeResult:
        """Create child widgets for the app."""
        yield Header()
        yield ScrollableContainer(
            Markdown(MD_HEADER),
            Button("Start", id="start"),
            self.text_log_widget,
        )
        yield Footer()

    def on_button_pressed(self, event: Button.Pressed) -> None:
        """Event handler called when a button is pressed."""
        if event.button.id == "start":
            btn = self.query_one("#start", expect_type=Button)
            self.django_app.toggle_button(btn)

    def action_quit(self):
        """Exit the application."""
        self.exit()

    def action_toggle_dark(self):
        """An action to toggle dark mode."""
        self.dark = not self.dark

    def exit(self, result=None, message=None):
        if self.django_app and self.django_app.is_running:
            self.django_app.app_server.stop()
        return super().exit(result, message)


def main():
    app = BmdsDesktop()
    app.run()
