import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("outputStore")
@observer
class CSTestofInterest extends Component {
    render() {
        const {outputStore} = this.props;
        return (
            <table className="table table-bordered table-sm">
                <thead className="table-primary">
                    <tr>
                        <th colSpan="4">Test of Interest</th>
                    </tr>
                    <tr>
                        <th>Test</th>
                        <th>-2*Log(Likelihood Ratio)</th>
                        <th>Test df</th>
                        <th>p-value</th>
                    </tr>
                </thead>
                <tbody>
                    {outputStore.getTestofInterest.map((row, index) => {
                        return (
                            <tr key={index}>
                                <td>{row.test_number}</td>
                                <td>{row.deviance}</td>
                                <td>{row.df}</td>
                                <td>{row.p_value}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
CSTestofInterest.propTypes = {
    outputStore: PropTypes.object,
    getTestofInterest: PropTypes.func,
};
export default CSTestofInterest;
