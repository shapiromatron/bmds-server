import _ from "lodash";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

@observer
class LitterData extends Component {
    render() {
        return (
            <table className="table table-sm table-bordered">
                <thead>
                    <tr className="bg-custom">
                        <th colSpan="8">Litter Data</th>
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
                    {_.range(10).map(d => {
                        return (
                            <tr key={d}>
                                <td>1</td>
                                <td>2</td>
                                <td>3</td>
                                <td>4</td>
                                <td>5</td>
                                <td>6</td>
                                <td>7</td>
                                <td>8</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
LitterData.propTypes = {
    model: PropTypes.object,
};

export default LitterData;
