import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("outputStore")
@observer
class CSLoglikelihoods extends Component {
    render() {
        const {outputStore} = this.props;
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
                    {outputStore.getLoglikelihoods.map((row, index) => {
                        return (
                            <tr key={index}>
                                <td>{row.model}</td>
                                <td>{row.loglikelihood}</td>
                                <td>{row.n_parms}</td>
                                <td>{row.aic}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
CSLoglikelihoods.propTypes = {
    outputStore: PropTypes.object,
    getLoglikelihoods: PropTypes.func,
};

export default CSLoglikelihoods;
