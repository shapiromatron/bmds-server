import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

@observer
class CSLoglikelihoods extends Component {
    render() {
        const {results} = this.props;
        return (
            <table className="table table-bordered table-sm">
                <thead className="table-primary">
                    <tr>
                        <th colSpan="4">Likelihoods of Interest</th>
                    </tr>
                    <tr>
                        <th>Model</th>
                        <th>Log Likelihood*</th>
                        <th># of Parameters</th>
                        <th>AIC</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan={4}>ADD - {results.aic}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
CSLoglikelihoods.propTypes = {
    results: PropTypes.object,
};

export default CSLoglikelihoods;
