import React from "react";
import PropTypes from "prop-types";

import {AdverseDirectionList, degree, background} from "../../../constants/dataConstants";
import * as mc from "../../../constants/mainConstants";

const Datasets = props => {
    return (
        <tr>
            <td>
                <input
                    id="enable-model"
                    type="checkbox"
                    checked={props.dataset.enabled}
                    onChange={e =>
                        props.toggleDataset("enabled", e.target.checked, props.dataset.dataset_id)
                    }
                />
            </td>
            <td>{props.dataset.dataset_name}</td>
            {props.model_type === mc.MODEL_CONTINUOUS ? (
                <td>
                    <select
                        className="form-control"
                        onChange={e =>
                            props.toggleDataset(
                                "adverse_direction",
                                e.target.value,
                                props.dataset.dataset_id
                            )
                        }>
                        {AdverseDirectionList.map((adverse, i) => {
                            return (
                                <option key={i} value={adverse.value}>
                                    {adverse.name}
                                </option>
                            );
                        })}
                    </select>
                </td>
            ) : null}
            {props.model_type === mc.MODEL_MULTI_TUMOR ? (
                <td>
                    <select
                        as="select"
                        onChange={e =>
                            props.toggleDataset("degree", e.target.value, props.dataset.dataset_id)
                        }>
                        {degree.map((dataset, i) => {
                            return (
                                <option key={i} value={dataset.value}>
                                    {dataset.name}
                                </option>
                            );
                        })}
                    </select>
                </td>
            ) : null}
            {props.model_type === mc.MODEL_MULTI_TUMOR ? (
                <td>
                    <select
                        as="select"
                        onChange={e =>
                            props.toggleDataset(
                                "background",
                                e.target.value,
                                props.dataset.dataset_id
                            )
                        }>
                        {background.map((dataset, i) => {
                            return (
                                <option key={i} value={dataset.value}>
                                    {dataset.name}
                                </option>
                            );
                        })}
                    </select>
                </td>
            ) : null}
        </tr>
    );
};

Datasets.propTypes = {
    saveAdverseDirection: PropTypes.func,
    toggleDataset: PropTypes.func.isRequired,
    datasets: PropTypes.array,
    degree: PropTypes.array,
    background: PropTypes.array,
    dataset: PropTypes.object.isRequired,
    model_type: PropTypes.string.isRequired,
};
export default Datasets;
