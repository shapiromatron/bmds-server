import _ from "lodash";
import {toJS} from "mobx";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

import {ff} from "@/utils/formatters";
// TODO: better # runs & combined handling
@observer
class BootstrapRuns extends Component {
    render() {
        const results = this.props.model.results.bootstrap,
            temp_rslt_len = results.n_runs + 1;
        return (
            <table className="table table-sm table-bordered">
                <thead className="bg-custom">
                    <tr>
                        <th colSpan="6">Bootstrap Runs</th>
                    </tr>
                    <tr>
                        <th>Run</th>
                        <th>
                            <i>P</i>-Value
                        </th>
                        <th>50th</th>
                        <th>90th</th>
                        <th>95th</th>
                        <th>99th</th>
                    </tr>
                </thead>
                <tbody>
                    {_.range(temp_rslt_len).map(i => {
                        return (
                            <tr key={i}>
                                <td>{i}</td>
                                <td>{results.p_value[i]}</td>
                                <td>{ff(results.p50[i])}</td>
                                <td>{ff(results.p90[i])}</td>
                                <td>{ff(results.p95[i])}</td>
                                <td>{ff(results.p99[i])}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
BootstrapRuns.propTypes = {
    model: PropTypes.object,
};
export default BootstrapRuns;
