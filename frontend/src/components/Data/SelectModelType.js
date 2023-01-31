import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

import Button from "../common/Button";
import LabelInput from "../common/LabelInput";
import SelectInput from "../common/SelectInput";

@inject("dataStore")
@observer
class SelectModelType extends Component {
    render() {
        const {dataStore} = this.props;
        return (
            <div className="model-type mb-2">
                <Button
                    className="btn btn-primary btn-sm float-right"
                    title="Can add up to 6 datasets"
                    disabled={!dataStore.canAddNewDataset}
                    icon="plus-square-fill"
                    text="New"
                    onClick={dataStore.addDataset}
                />
                <LabelInput label="New dataset" htmlFor="idFilteredDatasets" />{" "}
                <SelectInput
                    id="idFilteredDatasets"
                    onChange={value => dataStore.setModelType(value)}
                    value={dataStore.model_type}
                    choices={dataStore.getFilteredDatasetTypes.map(item => {
                        return {value: item.value, text: item.name};
                    })}
                />
            </div>
        );
    }
}
SelectModelType.propTypes = {
    dataStore: PropTypes.object,
};
export default SelectModelType;
