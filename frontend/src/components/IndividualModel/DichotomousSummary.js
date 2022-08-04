import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {ff, fourDecimalFormatter} from "utils/formatters";

@observer
class DichotomousSummary extends Component {
    render() {
        const {store} = this.props,
            results = store.modalModel.results;

        return (
            <table className="table table-sm table-bordered col-r-2">
                <colgroup>
                    <col width="60%" />
                    <col width="40%" />
                </colgroup>
                <thead>
                    <tr className="bg-custom">
                        <th colSpan="2">Summary</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>BMD</td>
                        <td>{ff(results.bmd)}</td>
                    </tr>
                    <tr>
                        <td>BMDL</td>
                        <td>{ff(results.bmdl)}</td>
                    </tr>
                    <tr>
                        <td>BMDU</td>
                        <td>{ff(results.bmdu)}</td>
                    </tr>
                    <tr>
                        <td>AIC</td>
                        <td>{ff(results.fit.aic)}</td>
                    </tr>
                    <tr>
                        <td>Log Likelihood</td>
                        <td>{ff(results.fit.loglikelihood)}</td>
                    </tr>
                    <tr>
                        <td>
                            <i>P</i>-Value
                        </td>
                        <td>{fourDecimalFormatter(results.gof.p_value)}</td>
                    </tr>
                    <tr>
                        <td>Overall DOF</td>
                        <td>{ff(results.gof.df)}</td>
                    </tr>
                    <tr>
                        <td>Chi-squared</td>
                        <td>{ff(results.fit.chisq)}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

DichotomousSummary.propTypes = {
    store: PropTypes.object,
};

export default DichotomousSummary;
