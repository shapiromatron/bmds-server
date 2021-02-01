import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {adverseDirectionOptions, degreeOptions} from "../../../constants/dataConstants";

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
                        onChange={e => handleChange(option.dataset_id, "enabled", e.target.checked)}
                    />
                </td>
                <td>{dataset.metadata.name}</td>
                {option.degree !== undefined ? (
                    <td>
                        <select
                            className="form-control"
                            value={option.degree}
                            onChange={e =>
                                handleChange(option.dataset_id, "degree", parseInt(e.target.value))
                            }>
                            {degreeOptions.map(item => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </td>
                ) : null}
                {option.adverse_direction !== undefined ? (
                    <td>
                        <select
                            className="form-control"
                            value={option.adverse_direction}
                            onChange={e =>
                                handleChange(
                                    option.dataset_id,
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
        );
    }
}

DatasetModelOption.propTypes = {
    dataset: PropTypes.object.isRequired,
    option: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
};
export default DatasetModelOption;
