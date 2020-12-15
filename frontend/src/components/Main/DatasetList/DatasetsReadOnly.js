import React from "react";
import PropTypes from "prop-types";

import {readOnlyCheckbox} from "../../../common";

const DatasetsReadOnly = props => {
    return (
        <tr>
            <td>{readOnlyCheckbox(props.dataset.enabled)}</td>
            <td>{props.dataset.dataset_name}</td>
            {props.dataset_type === "C" ? (
                <td>
                    <p>{props.dataset.adverse_direction}</p>
                </td>
            ) : null}
            {props.dataset_type === "DM" ? (
                <td>
                    <p>{props.dataset.degree}</p>
                </td>
            ) : null}
            {props.dataset_type === "DM" ? (
                <td>
                    <p>{props.dataset.background}</p>
                </td>
            ) : null}
        </tr>
    );
};
DatasetsReadOnly.propTypes = {
    dataset: PropTypes.object,
    dataset_type: PropTypes.string,
};
export default DatasetsReadOnly;
