import HelpTextPopover from "components/common/HelpTextPopover";
import _ from "lodash";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

import {parameterFormatter} from "../../utils/formatters";

@observer
class ModelParameters extends Component {
    render() {
        const {parameters} = this.props,
            indexes = _.range(parameters.names.length);

        return (
            <table className="table table-sm table-bordered text-right col-l-1">
                <colgroup>
                    <col width="20%" />
                    <col width="20%" />
                    <col width="20%" />
                    <col width="20%" />
                    <col width="20%" />
                </colgroup>
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
                                    {bounded ? (
                                        <>
                                            <span>Bounded</span>
                                            <HelpTextPopover
                                                title="Bounded"
                                                content={`The value of this parameter, ${parameters.values[i]}, is within the tolerance of the bound`}
                                            />
                                        </>
                                    ) : (
                                        parameterFormatter(parameters.values[i])
                                    )}
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
