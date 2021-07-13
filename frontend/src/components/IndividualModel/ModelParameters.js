import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {ff} from "../../common";
import {checkOrTimes} from "../../common";

@observer
class ModelParameters extends Component {
    render() {
        const {parameters} = this.props;
        return (
            <table className="table table-bordered table-sm">
                <thead>
                    <tr className="bg-custom">
                        <th colSpan="3">Model Parameters</th>
                    </tr>
                    <tr>
                        <th>Variable</th>
                        <th>Parameter (CI)</th>
                        <th>Bounded</th>
                    </tr>
                </thead>
                <tbody>
                    {parameters.names.map((name, i) => {
                        return (
                            <tr key={i}>
                                <td>{name}</td>
                                <td>
                                    {ff(parameters.values[i])}
                                    <br />({ff(parameters.lower_ci[i])},{ff(parameters.upper_ci[i])}
                                    )
                                </td>
                                <td>{checkOrTimes(parameters.bounded[i])}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
ModelParameters.propTypes = {
    parameters: PropTypes.object.isRequired,
};
export default ModelParameters;
