import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import {priorType} from "../../constants/outputConstants";

import {ff, getLabel} from "../../common";
@observer
class ModelData extends Component {
    render() {
        const {model} = this.props;
        return (
            <table className="table table-bordered table-sm">
                <thead>
                    <tr className="bg-custom">
                        <th colSpan="6">Priors</th>
                    </tr>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Initial Value</th>
                        <th>St. Dev.</th>
                        <th>Min Value</th>
                        <th>Max Value</th>
                    </tr>
                </thead>
                <tbody>
                    {model.settings.priors.priors.map((prior, i) => {
                        return (
                            <tr key={i}>
                                <td>{prior.name}</td>
                                <td>{getLabel(prior.type, priorType)}</td>
                                <td>{ff(prior.initial_value)}</td>
                                <td>{ff(prior.stdev)}</td>
                                <td>{ff(prior.min_value)}</td>
                                <td>{ff(prior.max_value)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}

ModelData.propTypes = {
    model: PropTypes.object.isRequired,
};
export default ModelData;
