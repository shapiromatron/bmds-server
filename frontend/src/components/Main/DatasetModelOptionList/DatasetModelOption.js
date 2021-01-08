import React from "react";
import PropTypes from "prop-types";

import {AdverseDirectionList, degree, background} from "../../../constants/dataConstants";
import * as mc from "../../../constants/mainConstants";

const DatasetModelOption = props => {
    const {dataset, handleChange, model_type} = props,
        datasetId = dataset.metadata.id;
    return (
        <tr>
            <td>
                <input
                    id="enable-model"
                    type="checkbox"
                    checked={dataset.enabled}
                    onChange={e => handleChange(datasetId, "enabled", e.target.checked)}
                />
            </td>
            <td>{dataset.metadata.name}</td>
            {model_type === mc.MODEL_CONTINUOUS ? (
                <td>
                    <select
                        className="form-control"
                        onChange={e =>
                            handleChange(datasetId, "adverse_direction", e.target.value)
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
            {model_type === mc.MODEL_MULTI_TUMOR ? (
                <td>
                    <select onChange={e => handleChange(datasetId, "degree", e.target.value)}>
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
            {model_type === mc.MODEL_MULTI_TUMOR ? (
                <td>
                    <select onChange={e => handleChange(datasetId, "background", e.target.value)}>
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

DatasetModelOption.propTypes = {
    dataset: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    model_type: PropTypes.string.isRequired,
};
export default DatasetModelOption;
