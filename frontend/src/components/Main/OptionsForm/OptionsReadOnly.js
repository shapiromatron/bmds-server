import React from "react";
import PropTypes from "prop-types";

import {MODEL_CONTINUOUS, MODEL_DICHOTOMOUS} from "../../../constants/mainConstants";
import {
    dichotomousBmrOptions,
    continuousBmrOptions,
    distTypeOptions,
} from "../../../constants/optionsConstants";
import {ff, getLabel} from "../../../common";

const OptionsReadOnly = props => {
    const {options, modelType} = props;
    console.log(options)
    return (
        <tr>
            {modelType === MODEL_CONTINUOUS ? (
                <>
                    <td>{getLabel(options.bmr_type, continuousBmrOptions)}</td>
                    <td>{ff(options.bmr_value)}</td>
                    <td>{ff(options.tail_probability)}</td>
                    <td>{ff(options.confidence_level * 100)}%</td>
                    <td>{getLabel(options.dist_type, distTypeOptions)}</td>
                </>
            ) : null}
            {modelType === MODEL_DICHOTOMOUS ? (
                <>
                    <td>{getLabel(options.bmr_type, dichotomousBmrOptions)}</td>
                    <td>{ff(options.bmr_value)}</td>
                    <td>{ff(options.confidence_level * 100)}%</td>
                </>
            ) : null}
        </tr>
    );
};
OptionsReadOnly.propTypes = {
    options: PropTypes.object,
    modelType: PropTypes.string.isRequired,
};
export default OptionsReadOnly;
