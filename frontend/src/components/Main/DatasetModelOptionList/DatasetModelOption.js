import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {adverseDirectionOptions} from "../../../constants/dataConstants";
import {Dtype} from "../../../constants/dataConstants";

@observer
class DatasetModelOption extends Component {
    render() {
        const {dataset, option, handleChange} = this.props;
        return (
            <tr>
                <td>
                    <input
                        id="enable-model"
                        type="checkbox"
                        checked={option.enabled}
                        onChange={e => handleChange(option.datasetId, "enabled", e.target.checked)}
                    />
                </td>
                <td>{dataset.metadata.name}</td>
                {dataset.dtype === Dtype.CONTINUOUS ||
                dataset.dtype === Dtype.CONTINUOUS_INDIVIDUAL ? (
                    <td>
                        <select
                            className="form-control"
                            value={option.adverse_direction}
                            onChange={e =>
                                handleChange(option.datasetId, "adverse_direction", e.target.value)
                            }>
                            {adverseDirectionOptions.map(item => (
                                <option key={item.value} value={item.value}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </td>
                ) : null}
            </tr>
        );
    }
}

DatasetModelOption.propTypes = {
    dataset: PropTypes.object.isRequired,
    option: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
};
export default DatasetModelOption;
