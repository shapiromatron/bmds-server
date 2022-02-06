import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

@observer
class ScaledResidual extends Component {
    render() {
        const {scaled_residual} = this.props;
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
                        <td>{scaled_residual.bmd1}</td>
                    </tr>
                    <tr>
                        <td>Minimum ABS(scaled residual) for dose group nearest the BMD</td>
                        <td>{scaled_residual.bmd2}</td>
                    </tr>
                    <tr>
                        <td>Average Scaled residual for dose group nearest the BMD</td>
                        <td>{scaled_residual.bmd3}</td>
                    </tr>
                    <tr>
                        <td>Average ABS(scaled residual) for dose group nearest the BMD</td>
                        <td>{scaled_residual.bmd4}</td>
                    </tr>
                    <tr>
                        <td>Maximum scaled residual for dose group nearest the BMD</td>
                        <td>{scaled_residual.bmd5}</td>
                    </tr>
                    <tr>
                        <td>Maximum ABS(scaled residual) for dose group nearest the BMD</td>
                        <td>{scaled_residual.bmd6}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
ScaledResidual.propTypes = {
    scaled_residual: PropTypes.object,
};

export default ScaledResidual;
