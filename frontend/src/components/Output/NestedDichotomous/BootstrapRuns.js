import {observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

class BootstrapRuns extends Component {
    render() {
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
                    <tr>
                        <td>{1}</td>
                        <td>{1}</td>
                        <td>{1}</td>
                        <td>{1}</td>
                        <td>{1}</td>
                        <td>{1}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
BootstrapRuns.propTypes = {
    model: PropTypes.object,
};
export default observer(BootstrapRuns);
