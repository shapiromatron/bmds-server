import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {ExponentialM3} from "../../constants/modelConstants";
import {parameterFormatter} from "../../utils/formatters";
import {checkOrTimes} from "../../common";

@observer
class ModelParameters extends Component {
    render() {
        const {name, parameters} = this.props,
            indexes = [];

        parameters.names.forEach((d, i) => {
            if (name === ExponentialM3 && parameters.names[i] === "c") {
                return;
            }
            indexes.push(i);
        });
        return (
            <table className="table table-sm table-bordered">
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
                    {indexes.map(i => {
                        return (
                            <tr key={i}>
                                <td>{parameters.names[i]}</td>
                                <td>
                                    {parameterFormatter(parameters.values[i])}
                                    <br />({parameterFormatter(parameters.lower_ci[i])},&nbsp;
                                    {parameterFormatter(parameters.upper_ci[i])})
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
    name: PropTypes.string.isRequired,
    parameters: PropTypes.object.isRequired,
};
export default ModelParameters;
