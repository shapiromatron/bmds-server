import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {
    adverseDirectionOptions,
    getDegreeOptions,
    allDegreeOptions,
} from "../../../constants/dataConstants";
import {getLabel, checkOrEmpty} from "../../../common";
import SelectInput from "../../common/SelectInput";

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
                    <SelectInput
                        choices={getDegreeOptions(dataset).map(option => {
                            return {value: option.value, text: option.label};
                        })}
                        onChange={value => updateOption(datasetId, "degree", value)}
                        value={option.degree}
                    />
                </td>
                {hasAdverseDirection ? (
                    <td>
                        <SelectInput
                            choices={adverseDirectionOptions.map(option => {
                                return {value: option.value, text: option.label};
                            })}
                            onChange={value => updateOption(datasetId, "adverse_direction", value)}
                            value={option.adverse_direction}
                        />
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
