import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import {priorClassLabels} from "../../constants/outputConstants";
import {Dtype} from "../../constants/dataConstants";
import {
    dichotomousBmrOptions,
    continuousBmrOptions,
    distTypeOptions,
} from "../../constants/optionsConstants";
import {ff, getLabel} from "../../common";

@observer
class ModelOptionsTable extends Component {
    render() {
        const {dtype, model} = this.props;
        let data = [];

        if (dtype == Dtype.DICHOTOMOUS) {
            data = [
                ["BMR Type", getLabel(model.settings.bmr_type, dichotomousBmrOptions)],
                ["BMR", ff(model.settings.bmr)],
                ["Alpha", ff(model.settings.alpha)],
                ["Degree", ff(model.settings.degree)],
                ["Samples", ff(model.settings.samples)],
                ["Burn In", ff(model.settings.burnin)],
                ["Prior Class", getLabel(model.settings.priors.prior_class, priorClassLabels)],
            ];
        } else if (dtype == Dtype.CONTINUOUS || dtype == Dtype.CONTINUOUS_INDIVIDUAL) {
            data = [
                ["Is Increasing", model.settings.is_increasing],
                ["Distribution Type", getLabel(model.settings.disttype, distTypeOptions)],
                ["BMR Type", getLabel(model.settings.bmr_type, continuousBmrOptions)],
                ["BMRF", ff(model.settings.bmr)],
                ["Tail Probability", ff(model.settings.tail_prob)],
                ["Alpha", ff(model.settings.alpha)],
                ["Degree", ff(model.settings.degree)],
                ["Samples", model.settings.samples],
                ["Burn In", model.settings.burnin],
                ["Prior Class", getLabel(model.settings.priors.prior_class, priorClassLabels)],
            ];
        } else {
            throw "Unknown dtype";
        }

        return (
            <table className="table table-sm table-bordered">
                <thead>
                    <tr className="bg-custom">
                        <th colSpan="2">Model Options</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((d, i) => {
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
