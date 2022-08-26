import {inject, observer} from "mobx-react";
import React, {Component} from "react";
import PropTypes from "prop-types";

import {MODEL_CONTINUOUS, MODEL_DICHOTOMOUS} from "constants/mainConstants";
import {adverseDirectionOptions, allDegreeOptions} from "constants/dataConstants";
import {
    dichotomousBmrOptions,
    continuousBmrOptions,
    distTypeOptions,
} from "constants/optionsConstants";
import {ff} from "utils/formatters";
import {getLabel} from "common";

@inject("outputStore")
@observer
class OptionSetTable extends Component {
    render() {
        const {outputStore} = this.props,
            {getModelType, selectedModelOptions, selectedDatasetOptions} = outputStore,
            option_index = outputStore.selectedOutput.option_index + 1;
        let rows;
        if (getModelType === MODEL_CONTINUOUS) {
            rows = [
                ["BMR Type", getLabel(selectedModelOptions.bmr_type, continuousBmrOptions)],
                ["BMRF", ff(selectedModelOptions.bmr_value)],
                ["Distribution Type", getLabel(selectedModelOptions.dist_type, distTypeOptions)],
                [
                    "Adverse Direction",
                    getLabel(selectedDatasetOptions.adverse_direction, adverseDirectionOptions),
                ],
                [
                    "Maximum Polynomial Degree",
                    getLabel(selectedDatasetOptions.degree, allDegreeOptions),
                ],
                ["Tail Probability", ff(selectedModelOptions.tail_probability)],
                ["Confidence Level", ff(selectedModelOptions.confidence_level)],
            ];
        } else if (getModelType === MODEL_DICHOTOMOUS) {
            rows = [
                ["BMR Type", getLabel(selectedModelOptions.bmr_type, dichotomousBmrOptions)],
                ["BMR", ff(selectedModelOptions.bmr_value)],
                ["Confidence Level", ff(selectedModelOptions.confidence_level)],
                [
                    "Maximum Multistage Degree",
                    getLabel(selectedDatasetOptions.degree, allDegreeOptions),
                ],
            ];
        } else {
            throw `Unknown model type: ${getModelType}`;
        }
        return (
            <>
                <div className="label">
                    <label>Option Set:&nbsp;</label>#{option_index}
                </div>
                <table className="table table-sm table-bordered text-right">
                    <colgroup>
                        <col width="60%" />
                        <col width="40%" />
                    </colgroup>
                    <tbody>
                        {rows.map((d, i) => {
                            return (
                                <tr key={i}>
                                    <th className="bg-custom">{d[0]}</th>
                                    <td>{d[1]}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </>
        );
    }
}
OptionSetTable.propTypes = {
    outputStore: PropTypes.object,
};

export default OptionSetTable;
