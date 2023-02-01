import _ from "lodash";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

import {getLabel} from "@/common";
import {isFrequentist, priorTypeLabels} from "@/constants/outputConstants";
import {ff} from "@/utils/formatters";

const renderPriorRow = prior => {
        return (
            <tr key={prior.name}>
                <td>{prior.name}</td>
                <td>{getLabel(prior.type, priorTypeLabels)}</td>
                <td>{ff(prior.initial_value)}</td>
                <td>{ff(prior.stdev)}</td>
                <td>{ff(prior.min_value)}</td>
                <td>{ff(prior.max_value)}</td>
            </tr>
        );
    },
    renderFrequentistRow = prior => {
        return (
            <tr key={prior.name}>
                <td>{prior.name}</td>
                <td>{ff(prior.initial_value)}</td>
                <td>{ff(prior.min_value)}</td>
                <td>{ff(prior.max_value)}</td>
            </tr>
        );
    };

@observer
class ParameterPriorTable extends Component {
    render() {
        const {parameters, priorClass} = this.props,
            isFreq = isFrequentist(priorClass),
            rowFunction = isFreq ? renderFrequentistRow : renderPriorRow,
            rows = _.range(parameters.names.length).map(idx => {
                return {
                    name: parameters.names[idx],
                    type: parameters.prior_type[idx],
                    initial_value: parameters.prior_initial_value[idx],
                    stdev: parameters.prior_stdev[idx],
                    min_value: parameters.prior_min_value[idx],
                    max_value: parameters.prior_max_value[idx],
                };
            });

        return (
            <table className="table table-sm table-bordered text-right col-l-1">
                <thead>
                    <tr className="bg-custom">
                        <th colSpan={isFreq ? 4 : 6}>Parameter Settings</th>
                    </tr>
                    {isFreq ? (
                        <tr>
                            <th>Name</th>
                            <th>Initial Value</th>
                            <th>Min Value</th>
                            <th>Max Value</th>
                        </tr>
                    ) : (
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Initial Value</th>
                            <th>Std. Dev.</th>
                            <th>Min Value</th>
                            <th>Max Value</th>
                        </tr>
                    )}
                </thead>
                <tbody>{rows.map(rowFunction)}</tbody>
            </table>
        );
    }
}

ParameterPriorTable.propTypes = {
    parameters: PropTypes.object.isRequired,
    priorClass: PropTypes.number.isRequired,
};
export default ParameterPriorTable;
