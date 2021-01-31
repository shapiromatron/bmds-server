import React from "react";
import PropTypes from "prop-types";

import {MODEL_CONTINUOUS, MODEL_DICHOTOMOUS} from "../../../constants/mainConstants";

const OptionsReadOnly = props => {
    const {options, modelType} = props;
    return (
        <tr>
            {modelType === MODEL_CONTINUOUS ? (
                <>
                    <td>{options.bmr_type}</td>
                    <td>{options.bmr_value}</td>
                    <td>{options.tail_probability}</td>
                    <td>{options.confidence_level}</td>
                    <td>{options.dist_type}</td>
                </>
            ) : null}
            {modelType === MODEL_DICHOTOMOUS ? (
                <>
                    <td>{options.bmr_type}</td>
                    <td>{options.bmr_value}</td>
                    <td>{options.confidence_level}%</td>
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
