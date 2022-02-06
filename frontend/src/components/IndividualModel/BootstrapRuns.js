import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {ff} from "../../common";

@observer
class BootstrapRuns extends Component {
    render() {
        const {bootstrap_runs} = this.props;
        return (
            <table className="table table-sm table-bordered">
                <thead className="bg-custom">
                    <tr>
                        <th colSpan="9">Bootstrap Runs</th>
                    </tr>
                    <tr>
                        <th>Run</th>
                        <th>p-Value</th>
                        <th>50th</th>
                        <th>90th</th>
                        <th>95th</th>
                        <th>99th</th>
                    </tr>
                </thead>
                <tbody>
                    {bootstrap_runs.runs.map((run, i) => {
                        return (
                            <tr key={i}>
                                <td>{run}</td>
                                <td>{ff(BootstrapRuns.runs[i].p_value)}</td>
                                <td>{ff(BootstrapRuns.runs[i].fifty_percentile)}</td>
                                <td>{ff(BootstrapRuns.runs[i].ninty_percentile)}</td>
                                <td>{ff(BootstrapRuns.runs[i].ninetyfive_percentile)}</td>
                                <td>{ff(BootstrapRuns.runs[i].ninetyninth_percentile)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
BootstrapRuns.propTypes = {
    bootstrap_runs: PropTypes.object,
};

export default BootstrapRuns;
