import pathlib
import sys


def get_datadir() -> pathlib.Path:
    """
    Returns a parent directory path
    where persistent application data can be stored.

    # linux: ~/.local/share
    # macOS: ~/Library/Application Support
    # windows: C:/Users/<USER>/AppData/Roaming
    """
    home = pathlib.Path.home()
    match sys.platform:
        case "win32":
            return home / "AppData" / "Roaming"
        case "darwin":
            return home / "Library" / "Application Support"
        case _:
            raise OSError(f"Unknown platform {sys.platform}")
