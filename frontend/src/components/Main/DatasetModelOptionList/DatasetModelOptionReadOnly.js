import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {readOnlyCheckbox} from "../../../common";

@observer
class DatasetModelOptionReadOnly extends Component {
    render() {
        const {dataset, option} = this.props;
        return (
            <tr>
                <td>{readOnlyCheckbox(option.enabled)}</td>
                <td>{dataset.metadata.name}</td>
                {option.degree !== undefined ? <td>{option.degree}</td> : null}
                {option.adverse_direction !== undefined ? (
                    <td>{option.adverse_direction}</td>
                ) : null}
            </tr>
        );
    }
}
DatasetModelOptionReadOnly.propTypes = {
    dataset: PropTypes.object.isRequired,
    option: PropTypes.object.isRequired,
};
export default DatasetModelOptionReadOnly;
