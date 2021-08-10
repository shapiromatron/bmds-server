import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {
    adverseDirectionOptions,
    getDegreeOptions,
    allDegreeOptions,
} from "../../../constants/dataConstants";
import {getLabel, checkOrEmpty} from "../../../common";

@observer
class DatasetModelOption extends Component {
    render() {
        const {datasetId, store} = this.props,
            option = store.options[datasetId],
            dataset = store.getDataset(option),
            {canEdit, updateOption} = store,
            hasAdverseDirection = option.adverse_direction !== undefined;

        return canEdit ? (
            <tr>
                <td>
                    <input
                        id="enable-model"
                        type="checkbox"
                        checked={option.enabled}
                        onChange={e => updateOption(datasetId, "enabled", e.target.checked)}
                    />
                </td>
                <td>{dataset.metadata.name}</td>
                <td>
                    <select
                        className="form-control"
                        value={option.degree}
                        onChange={e => updateOption(datasetId, "degree", parseInt(e.target.value))}>
                        {getDegreeOptions(dataset).map(item => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </td>
                {hasAdverseDirection ? (
                    <td>
                        <select
                            className="form-control"
                            value={option.adverse_direction}
                            onChange={e =>
                                updateOption(
                                    datasetId,
                                    "adverse_direction",
                                    parseInt(e.target.value)
                                )
                            }>
                            {adverseDirectionOptions.map(item => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </td>
                ) : null}
            </tr>
        ) : (
            <tr>
                <td>{checkOrEmpty(option.enabled)}</td>
                <td>{dataset.metadata.name}</td>
                <td>{getLabel(option.degree, allDegreeOptions)}</td>
                {hasAdverseDirection ? (
                    <td>{getLabel(option.adverse_direction, adverseDirectionOptions)}</td>
                ) : null}
            </tr>
        );
    }
}

DatasetModelOption.propTypes = {
    datasetId: PropTypes.number.isRequired,
    store: PropTypes.object,
};
export default DatasetModelOption;
