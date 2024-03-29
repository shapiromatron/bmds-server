import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";

import Icon from "@/components/common/Icon";

const KEY = "bmds.data",
    DEFAULT_HISTORY = {enabled: true, history: {}},
    HistoryTable = ({history}) => {
        if (history.length === 0) {
            return (
                <div className="alert alert-secondary">
                    <p className="mb-0">
                        <Icon name="clock-history" text="No history available." />
                    </p>
                </div>
            );
        }
        return (
            <table className="table table-sm table-striped">
                <thead>
                    <tr>
                        <th>Last viewed</th>
                        <th>Analysis URL</th>
                    </tr>
                </thead>
                <colgroup>
                    <col width="200px" />
                </colgroup>
                <tbody>
                    {history.map(run => {
                        return (
                            <tr key={run.lastAccess}>
                                <td>{new Date(run.lastAccess).toLocaleString()}</td>
                                <td>
                                    <a href={run.href}>{run.href}</a>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };
HistoryTable.propTypes = {
    history: PropTypes.arrayOf(PropTypes.object),
};

class LocalHistory {
    constructor() {
        this._data = null;
    }
    getData() {
        if (this._data === null) {
            this._data = this._load();
        }
        return this._data;
    }
    _load() {
        try {
            return JSON.parse(window.localStorage.getItem(KEY)) || DEFAULT_HISTORY;
        } catch (error) {
            return DEFAULT_HISTORY;
        }
    }
    _save(data) {
        window.localStorage.setItem(KEY, JSON.stringify(data));
    }
    log() {
        const data = this.getData(),
            {protocol, host, pathname} = window.location,
            MAX_SIZE = 120,
            TRIM_SIZE = 100;
        if (data.enabled) {
            const url = `${protocol}//${host}${pathname}`;
            data.history[url] = Date.now();
            // trim MAX_SIZE runs down to TRIM_SIZE
            if (_.keys(data.history).length >= MAX_SIZE) {
                data.history = _.chain(data.history)
                    .toPairs()
                    .sortBy(d => d[1])
                    .reverse()
                    .slice(0, TRIM_SIZE)
                    .fromPairs()
                    .value();
            }
            this._save(data);
        }
    }
    render(el) {
        const data = this.getData(),
            historyArray = _.chain(data.history)
                .map((lastAccess, href) => {
                    return {href, lastAccess};
                })
                .orderBy(["lastAccess"], ["desc"])
                .value();
        ReactDOM.render(<HistoryTable history={historyArray} />, el);
    }
    enable() {
        this._save(DEFAULT_HISTORY);
    }
    disable() {
        this._save({enabled: false, history: {}});
    }
}

const history = new LocalHistory();

export default history;
