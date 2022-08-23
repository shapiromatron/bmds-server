import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

import SelectInput from "../common/SelectInput";
import LabelInput from "../common/LabelInput";
import Button from "../common/Button";

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
                    faClass="fa fa-fw fa-plus-square"
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
