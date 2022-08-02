import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {ff, fractionalFormatter} from "utils/formatters";

@observer
class ContinuousTestOfInterest extends Component {
    render() {
        const {store} = this.props,
            testInterest = store.modalModel.results.tests;

        return (
            <table className="table table-sm table-bordered text-right">
                <thead>
                    <tr className="bg-custom text-left">
                        <th colSpan="4">Test of Interest</th>
                    </tr>
                    <tr>
                        <th>Test</th>
                        <th>Likelihood Ratio</th>
                        <th>DF</th>
                        <th>
                            <i>P</i>-Value
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {testInterest.names.map((name, i) => {
                        return (
                            <tr key={i}>
                                <td>{name}</td>
                                <td>{ff(testInterest.ll_ratios[i])}</td>
                                <td>{ff(testInterest.dfs[i])}</td>
                                <td>{fractionalFormatter(testInterest.p_values[i])}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
ContinuousTestOfInterest.propTypes = {
    store: PropTypes.object,
};
export default ContinuousTestOfInterest;
