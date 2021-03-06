import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {ff} from "../../common";

@observer
class CSTestofInterest extends Component {
    render() {
        const {store} = this.props,
            testInterest = store.modalModel.results.tests;

        return (
            <table className="table table-bordered table-sm">
                <thead className="table-primary">
                    <tr>
                        <th colSpan="4">Test of Interest</th>
                    </tr>
                    <tr>
                        <th>Test</th>
                        <th>Likelihood Ratio</th>
                        <th>DF</th>
                        <th>P Value</th>
                    </tr>
                </thead>
                <tbody>
                    {testInterest.names.map((name, i) => {
                        return (
                            <tr key={i}>
                                <td>{name}</td>
                                <td>{ff(testInterest.ll_ratios[i])}</td>
                                <td>{ff(testInterest.dfs[i])}</td>
                                <td>{ff(testInterest.p_values[i])}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
CSTestofInterest.propTypes = {
    store: PropTypes.object,
};
export default CSTestofInterest;
