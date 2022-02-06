import _ from "lodash";
import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {ff} from "../../common";

@observer
class LitterData extends Component {
    render() {
        const {litter_data} = this.props;
        return (
            <table className="table table-sm table-bordered">
                <thead>
                    <tr className="bg-custom">
                        <th colSpan="2">CDF</th>
                    </tr>
                    <tr>
                        <th>Dose</th>
                        <th>Lit. Spec. Cov.</th>
                        <th>Lit. Spec. Cov.</th>
                        <th>Est. Prob.</th>
                        <th>Liter Size</th>
                        <th>Expected</th>
                        <th>Observed</th>
                        <th>Scaled Residual</th>
                    </tr>
                </thead>
                <tbody>
                    {litter_data[0].length == 0 ? (
                        <tr>
                            <td colSpan={2}>
                                <i>No data available.</i>
                            </td>
                        </tr>
                    ) : (
                        _.range(litter_data[0].length).map(i => {
                            return (
                                <tr key={i}>
                                    <td>{ff(litter_data[0][i])}</td>
                                    <td>{ff(litter_data[1][i])}</td>
                                    <td>{ff(litter_data[2][i])}</td>
                                    <td>{ff(litter_data[3][i])}</td>
                                    <td>{ff(litter_data[4][i])}</td>
                                    <td>{ff(litter_data[5][i])}</td>
                                    <td>{ff(litter_data[6][i])}</td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        );
    }
}
LitterData.propTypes = {
    litter_data: PropTypes.array,
};

export default LitterData;
