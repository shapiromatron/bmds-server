import React from "react";
import PropTypes from "prop-types";

import * as mc from "../../../constants/mainConstants";
import {readOnlyCheckbox} from "../../../common";

const DatasetsReadOnly = props => {
    return (
        <tr>
            <td>{readOnlyCheckbox(props.dataset.enabled)}</td>
            <td>{props.dataset.dataset_name}</td>
            {props.model_type === mc.MODEL_CONTINUOUS ? (
                <td>
                    <p>{props.dataset.adverse_direction}</p>
                </td>
            ) : null}
            {props.model_type === mc.MODEL_MULTI_TUMOR ? (
                <td>
                    <p>{props.dataset.degree}</p>
                </td>
            ) : null}
            {props.model_type === mc.MODEL_MULTI_TUMOR ? (
                <td>
                    <p>{props.dataset.background}</p>
                </td>
            ) : null}
        </tr>
    );
};
DatasetsReadOnly.propTypes = {
    dataset: PropTypes.object.isRequired,
    model_type: PropTypes.string.isRequired,
};
export default DatasetsReadOnly;
