from datetime import datetime, timedelta, timezone
from typing import Dict

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from django_redis import get_redis_connection
from matplotlib.axes import Axes
from matplotlib.dates import DateFormatter

from ..main.celery import app


class WorkerHealthcheck:
    KEY = "worker-healthcheck"
    MAX_SIZE = 60 * 24 // 5  # 1 day of data at a 5 minute-interval
    MAX_WAIT = timedelta(minutes=15)  # check is a failure if no task has run in X minutes

    def _get_conn(self):
        return get_redis_connection()

    def clear(self):
        """
        Clear worker healthcheck array
        """
        conn = self._get_conn()
        conn.delete(self.KEY)

    def push(self):
        """
        Push the latest successful time and trim the size of the array to max size
        """
        conn = self._get_conn()
        pipeline = conn.pipeline()
        pipeline.lpush(self.KEY, datetime.now(timezone.utc).timestamp())
        pipeline.ltrim(self.KEY, 0, self.MAX_SIZE - 1)
        pipeline.execute()

    def healthy(self) -> bool:
        """Check if an item in the array has executed with the MAX_WAIT time from now"""
        conn = self._get_conn()
        last_push = conn.lindex(self.KEY, 0)
        if last_push is None:
            return False
        last_ping = datetime.fromtimestamp(float(last_push), timezone.utc)
        return datetime.now(timezone.utc) - last_ping < self.MAX_WAIT

    def series(self) -> pd.Series:
        """Return a pd.Series of last successful times"""
        conn = self._get_conn()
        data = conn.lrange(self.KEY, 0, -1)
        return pd.to_datetime(pd.Series(data, dtype=float), unit="s", utc=True)

    def plot(self) -> Axes:
        """Plot the current array of available timestamps"""
        series = self.series()
        return event_plot(series)

    def stats(self) -> Dict:
        inspect = app.control.inspect()
        stats = dict(ping=inspect.ping())
        if stats["ping"]:
            stats.update(active=inspect.active(), stats=inspect.stats())
        return stats


def empty_mpl_figure(title: str = "No data available.") -> Axes:
    """Create a matplotlib figure with no data"""
    plt.figure(figsize=(3, 1))
    plt.axis("off")
    plt.suptitle(title)
    return plt.gca()


def event_plot(series: pd.Series) -> Axes:
    """Return matplotlib event plot"""
    plt.style.use("bmh")

    if series.empty:
        return empty_mpl_figure()

    df = series.to_frame(name="timestamp")
    df.loc[:, "event"] = 1 + (np.random.rand(df.size) - 0.5) / 5  # jitter
    ax = df.plot.scatter(
        x="timestamp",
        y="event",
        c="None",
        edgecolors="blue",
        alpha=1,
        s=80,
        figsize=(15, 5),
        legend=False,
        grid=True,
    )

    # set x axis
    ax.xaxis.set_major_formatter(DateFormatter("%b %d %H:%M"))
    buffer = ((series.max() - series.min()) / 30) + timedelta(seconds=1)
    ax.set_xlim(left=series.min() - buffer, right=pd.Timestamp.utcnow() + buffer)
    ax.set_xlabel("Timestamp (UTC)")

    # set y axis
    ax.set_ybound(0, 2)
    ax.axes.get_yaxis().set_visible(False)

    plt.tight_layout()
    return ax


worker_healthcheck = WorkerHealthcheck()
