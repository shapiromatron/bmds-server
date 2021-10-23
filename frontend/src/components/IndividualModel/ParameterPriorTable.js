import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import {isFrequentist, priorTypeLabels} from "../../constants/outputConstants";

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

import {ff, getLabel} from "../../common";
@observer
class ParameterPriorTable extends Component {
    render() {
        const {priors} = this.props,
            isFreq = isFrequentist(priors.prior_class),
            rowFunction = isFreq ? renderFrequentistRow : renderPriorRow;

        return (
            <table className="table table-sm table-bordered">
                <thead>
                    <tr className="bg-custom">
                        <th colSpan={isFreq ? 4 : 6}>Priors</th>
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
                <tbody>
                    {priors.priors.map(rowFunction)}
                    {priors.variance_priors ? priors.variance_priors.map(rowFunction) : null}
                </tbody>
            </table>
        );
    }
}

ParameterPriorTable.propTypes = {
    priors: PropTypes.object.isRequired,
};
export default ParameterPriorTable;
