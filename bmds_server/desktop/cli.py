from importlib.metadata import version

from textual.app import App, ComposeResult
from textual.widgets import Footer, Header


class BmdsDesktop(App):
    """A Textual app for BMDS."""

    TITLE = f"BMDS Desktop (version {version('bmds_server')})"
    BINDINGS = [("q", "quit", "Quit"), ("d", "toggle_dark", "Toggle dark mode")]

    def compose(self) -> ComposeResult:
        """Create child widgets for the app."""
        yield Header()
        yield Footer()

    def action_quit(self):
        """Exit the application."""
        self.exit()

    def action_toggle_dark(self):
        """An action to toggle dark mode."""
        self.dark = not self.dark


def main():
    app = BmdsDesktop()
    app.run()
