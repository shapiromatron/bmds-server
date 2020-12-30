import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

@observer
class CSTestofInterest extends Component {
    render() {
        const {results} = this.props;
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
                    <tr>
                        <td colSpan={4}>ADD - {results.aic}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
CSTestofInterest.propTypes = {
    results: PropTypes.object,
};
export default CSTestofInterest;
