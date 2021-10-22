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
                <LabelInput label="New dataset" htmlFor="idFilteredDatasets" />
                <div className="input-group">
                    <SelectInput
                        id="idFilteredDatasets"
                        onChange={value => dataStore.setModelType(value)}
                        value={dataStore.model_type}
                        choices={dataStore.getFilteredDatasetTypes.map(item => {
                            return {value: item.value, text: item.name};
                        })}
                    />
                    <div className="input-group-append">
                        <Button
                            className="btn btn-primary btn-sm float-right"
                            disabled={dataStore.checkDatasetsLength}
                            faClass="fa fa-fw fa-plus"
                            text="Create"
                            onClick={dataStore.addDataset}
                        />
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
