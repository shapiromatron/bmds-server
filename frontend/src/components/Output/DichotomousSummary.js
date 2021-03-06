import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {ff} from "../../common";

@observer
class DichotomousSummary extends Component {
    render() {
        const {store} = this.props,
            results = store.modalModel.results;

        return (
            <table className="table table-bordered table-sm">
                <thead>
                    <tr className="table-primary">
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
                        <td>LL</td>
                        <td>{ff(results.fit.loglikelihood)}</td>
                    </tr>
                    <tr>
                        <td>model_df</td>
                        <td>{ff(results.fit.model_df)}</td>
                    </tr>
                    <tr>
                        <td>p-value</td>
                        <td>{ff(results.gof.p_value)}</td>
                    </tr>
                    <tr>
                        <td>DOF</td>
                        <td>{ff(results.fit.total_df)}</td>
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
