import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {ff} from "../../common";

@observer
class BootstrapResult extends Component {
    render() {
        const {bootstrap_results} = this.props;
        return (
            <table className="table table-sm table-bordered">
                <thead className="bg-custom">
                    <tr>
                        <th colSpan="9">Bootstrap Results</th>
                    </tr>
                    <tr>
                        <th># Iterations</th>
                        <th>Bootstrap Seed</th>
                        <th>Log-likelihood</th>
                        <th>Observed Chi-square</th>
                        <th>Combined P-value</th>
                    </tr>
                </thead>
                <tbody>
                    {bootstrap_results.names.map((name, i) => {
                        return (
                            <tr key={i}>
                                <td>{name}</td>
                                <td>{ff(bootstrap_results.bootstrap_seed[i])}</td>
                                <td>{bootstrap_results.log_likelihood[i]}</td>
                                <td>{ff(bootstrap_results.chisq[i])}</td>
                                <td>{ff(bootstrap_results.pvalue[i])}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
BootstrapResult.propTypes = {
    bootstrap_results: PropTypes.object,
};

export default BootstrapResult;
