import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

@observer
class BootstrapResult extends Component {
    render() {
        return (
            <table className="table table-sm table-bordered">
                <thead className="bg-custom">
                    <tr>
                        <th colSpan="2">Bootstrap Results</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th># Iterations</th>
                        <td>{1}</td>
                    </tr>
                    <tr>
                        <th>Bootstrap Seed</th>
                        <td>{1}</td>
                    </tr>
                    <tr>
                        <th>Log-likelihood</th>
                        <td>{1}</td>
                    </tr>
                    <tr>
                        <th>Observed Chi-square</th>
                        <td>{1}</td>
                    </tr>
                    <tr>
                        <th>Combined P-value</th>
                        <td>{1}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
BootstrapResult.propTypes = {
    model: PropTypes.object,
};

export default BootstrapResult;
