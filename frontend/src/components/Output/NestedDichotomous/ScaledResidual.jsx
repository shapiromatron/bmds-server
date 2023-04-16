import {observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

class ScaledResidual extends Component {
    render() {
        return (
            <table id="info-table" className="table table-sm table-bordered">
                <thead>
                    <tr className="bg-custom">
                        <th colSpan="2" className="text-center">
                            Scaled Residuals
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Minimum scaled residual for dose group nearest the BMD</td>
                        <td>{1}</td>
                    </tr>
                    <tr>
                        <td>Minimum ABS(scaled residual) for dose group nearest the BMD</td>
                        <td>{1}</td>
                    </tr>
                    <tr>
                        <td>Average Scaled residual for dose group nearest the BMD</td>
                        <td>{1}</td>
                    </tr>
                    <tr>
                        <td>Average ABS(scaled residual) for dose group nearest the BMD</td>
                        <td>{1}</td>
                    </tr>
                    <tr>
                        <td>Maximum scaled residual for dose group nearest the BMD</td>
                        <td>{1}</td>
                    </tr>
                    <tr>
                        <td>Maximum ABS(scaled residual) for dose group nearest the BMD</td>
                        <td>{1}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
ScaledResidual.propTypes = {
    model: PropTypes.object,
};

export default observer(ScaledResidual);
