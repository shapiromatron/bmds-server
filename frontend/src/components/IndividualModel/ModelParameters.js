import _ from "lodash";
import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {parameterFormatter} from "../../utils/formatters";

@observer
class ModelParameters extends Component {
    render() {
        const {parameters} = this.props,
            indexes = _.range(parameters.names.length);

        return (
            <table className="table table-sm table-bordered">
                <thead>
                    <tr className="bg-custom">
                        <th colSpan="5">Model Parameters</th>
                    </tr>
                    <tr>
                        <th>Variable</th>
                        <th>Estimate</th>
                        <th>Standard Error</th>
                        <th>Lower Confidence</th>
                        <th>Upper Confidence</th>
                    </tr>
                </thead>
                <tbody>
                    {indexes.map(i => {
                        const bounded = parameters.bounded[i];
                        return (
                            <tr key={i}>
                                <td>{parameters.names[i]}</td>
                                <td>
                                    {bounded ? "Bounded" : parameterFormatter(parameters.values[i])}
                                </td>
                                <td>{bounded ? "NA" : parameterFormatter(parameters.se[i])}</td>
                                <td>
                                    {bounded ? "NA" : parameterFormatter(parameters.lower_ci[i])}
                                </td>
                                <td>
                                    {bounded ? "NA" : parameterFormatter(parameters.upper_ci[i])}
                                </td>
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
