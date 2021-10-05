import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import SelectInput from "../common/SelectInput";
import LabelInput from "../common/LabelInput";

@inject("dataStore")
@observer
class SelectModelType extends Component {
    render() {
        const {dataStore} = this.props;
        return (
            <div className="model-type mb-2">
                {/* ADD label back; htmlFor is broken */}
                <LabelInput label="New dataset" />
                <div className="input-group">
                    <SelectInput
                        onChange={value => dataStore.setModelType(value)}
                        value={dataStore.model_type}
                        choices={dataStore.getFilteredDatasetTypes.map(item => {
                            return {value: item.value, text: item.name};
                        })}
                    />
                    <div className="input-group-append">
                        <button
                            type="button"
                            className="btn btn-primary btn-sm float-right"
                            disabled={dataStore.checkDatasetsLength}
                            onClick={dataStore.addDataset}>
                            <i className="fa fa-fw fa-plus" />
                            Create
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
SelectModelType.propTypes = {
    dataStore: PropTypes.object,
};
export default SelectModelType;
