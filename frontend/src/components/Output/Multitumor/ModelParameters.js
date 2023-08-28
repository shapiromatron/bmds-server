import _ from "lodash";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

import {ff} from "@/utils/formatters";
@observer
class ModelParameters extends Component {
    render() {
        const model = this.props.model.parameters,
            temp_rslt_len = _.size(model.bounded);
        return (
            <table className="table table-sm table-bordered">
                <thead>
                    <tr className="bg-custom">
                        <th colSpan="6">Model Parameters</th>
                    </tr>
                    <tr>
                        <th>Variable</th>
                        <th>Estimate</th>
                        <th>Bounded</th>
                        <th>Std Error</th>
                        <th>Lower CI</th>
                        <th>Upper CI</th>
                    </tr>
                </thead>
                <tbody>
                    {_.range(temp_rslt_len).map(i => {
                        return (
                            <tr key={i}>
                                <td>{model.names[i]}</td>
                                <td>???</td>
                                <td>{model.bounded[i]}</td>
                                <td>{ff(model.se[i])}</td>
                                <td>{ff(model.lower_ci[i])}</td>
                                <td>{ff(model.upper_ci[i])}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
ModelParameters.propTypes = {
    model: PropTypes.object,
};

export default ModelParameters;
