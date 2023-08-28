import _ from "lodash";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

@observer
class ModelParameters extends Component {
    render() {
        const dataset = this.props.model,
            temp_rslt_len = _.size(dataset.doses);
        return (
            <table className="table table-sm table-bordered">
                <thead>
                    <tr className="bg-custom">
                        <th colSpan="6">ModelParameters</th>
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
                                <td>{dataset.doses[i]}</td>
                                <td>{dataset.incidences[i]}</td>
                                <td>{dataset.ns[i]}</td>
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
