import {observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";
import {ff} from "utils/formatters";

import {getLabel} from "../../common";
import {Dtype} from "../../constants/dataConstants";
import {hasDegrees} from "../../constants/modelConstants";
import {
    continuousBmrOptions,
    dichotomousBmrOptions,
    distTypeOptions,
} from "../../constants/optionsConstants";
import {priorClassLabels} from "../../constants/outputConstants";

const restrictionMapping = {
    0: ["Model Restriction", "Unrestricted"],
    1: ["Model Restriction", "Restricted"],
    2: ["Model Approach", "Bayesian"],
};

@observer
class ModelOptionsTable extends Component {
    render() {
        const {dtype, model} = this.props,
            priorLabels = restrictionMapping[model.settings.priors.prior_class],
            priorClass = getLabel(model.settings.priors.prior_class, priorClassLabels),
            isBayesian = priorClass === "Bayesian";
        let data = [];

        if (dtype == Dtype.DICHOTOMOUS) {
            data = [
                ["BMR Type", getLabel(model.settings.bmr_type, dichotomousBmrOptions)],
                ["BMR", ff(model.settings.bmr)],
                ["Confidence Level", ff(1 - model.settings.alpha)],
                hasDegrees.has(model.model_class.verbose)
                    ? ["Degree", ff(model.settings.degree)]
                    : null,
                priorLabels,
                isBayesian ? ["Samples", ff(model.settings.samples)] : null,
                isBayesian ? ["Burn In", ff(model.settings.burnin)] : null,
            ];
        } else if (dtype == Dtype.CONTINUOUS || dtype == Dtype.CONTINUOUS_INDIVIDUAL) {
            data = [
                ["BMR Type", getLabel(model.settings.bmr_type, continuousBmrOptions)],
                ["BMRF", ff(model.settings.bmr)],
                ["Distribution Type", getLabel(model.settings.disttype, distTypeOptions)],
                ["Direction", model.settings.is_increasing ? "Up" : "Down"],
                ["Confidence Level", 1 - ff(model.settings.alpha)],
                ["Tail Probability", ff(model.settings.tail_prob)],
                hasDegrees.has(model.model_class.verbose)
                    ? ["Degree", ff(model.settings.degree)]
                    : null,
                priorLabels,
                isBayesian ? ["Samples", model.settings.samples] : null,
                isBayesian ? ["Burn In", model.settings.burnin] : null,
            ];
        } else {
            throw "Unknown dtype";
        }

        return (
            <table className="table table-sm table-bordered col-r-2">
                <thead>
                    <tr className="bg-custom">
                        <th colSpan="2">Model Options</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((d, i) => {
                        if (!d) {
                            return null;
                        }
                        return (
                            <tr key={i}>
                                <td>{d[0]}</td>
                                <td>{d[1]}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
ModelOptionsTable.propTypes = {
    dtype: PropTypes.string.isRequired,
    model: PropTypes.object.isRequired,
};
export default ModelOptionsTable;
