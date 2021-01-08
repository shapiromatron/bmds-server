import React from "react";
import PropTypes from "prop-types";

import * as mc from "../../../constants/mainConstants";
import {readOnlyCheckbox} from "../../../common";

const DatasetModelOptionReadOnly = props => {
    const {dataset, model_type} = props;
    return (
        <tr>
            <td>{readOnlyCheckbox(dataset.enabled)}</td>
            <td>{dataset.metadata.name}</td>
            {model_type === mc.MODEL_CONTINUOUS ? <td>{dataset.adverse_direction}</td> : null}
            {model_type === mc.MODEL_MULTI_TUMOR ? <td>{dataset.degree}</td> : null}
            {model_type === mc.MODEL_MULTI_TUMOR ? <td>{dataset.background}</td> : null}
        </tr>
    );
};
DatasetModelOptionReadOnly.propTypes = {
    dataset: PropTypes.object.isRequired,
    model_type: PropTypes.string.isRequired,
};
export default DatasetModelOptionReadOnly;
