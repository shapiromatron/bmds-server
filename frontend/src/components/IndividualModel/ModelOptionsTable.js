import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import {priorClassLabels} from "../../constants/outputConstants";
import {Dtype} from "../../constants/dataConstants";
import {hasDegrees} from "../../constants/modelConstants";
import {
    dichotomousBmrOptions,
    continuousBmrOptions,
    distTypeOptions,
} from "../../constants/optionsConstants";
import {getLabel} from "../../common";
import {ff} from "utils/formatters";

@observer
class ModelOptionsTable extends Component {
    render() {
        const {dtype, model} = this.props,
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
                ["Parameter Class", priorClass],
                isBayesian ? ["Samples", ff(model.settings.samples)] : null,
                isBayesian ? ["Burn In", ff(model.settings.burnin)] : null,
            ];
        } else if (dtype == Dtype.CONTINUOUS || dtype == Dtype.CONTINUOUS_INDIVIDUAL) {
            data = [
                ["Is Increasing", model.settings.is_increasing],
                ["Distribution Type", getLabel(model.settings.disttype, distTypeOptions)],
                ["BMR Type", getLabel(model.settings.bmr_type, continuousBmrOptions)],
                ["BMRF", ff(model.settings.bmr)],
                ["Tail Probability", ff(model.settings.tail_prob)],
                ["Alpha", ff(model.settings.alpha)],
                hasDegrees.has(model.model_class.verbose)
                    ? ["Degree", ff(model.settings.degree)]
                    : null,
                ["Prior Class", priorClass],
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
