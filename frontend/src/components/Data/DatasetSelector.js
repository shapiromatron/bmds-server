import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

import SelectInput from "../common/SelectInput";

@inject("dataStore")
@observer
class DatasetSelector extends Component {
    render() {
        const {dataStore, store} = this.props;
        return (
            <SelectInput
                onChange={value => store.setSelectedDataset(parseInt(value))}
                label="Existing datasets"
                value={store.selectedDatasetId}
                choices={dataStore.datasets.map(dataset => {
                    return {value: dataset.metadata.id, text: dataset.metadata.name};
                })}
            />
        );
    }
}
DatasetSelector.propTypes = {
    dataStore: PropTypes.object,
    store: PropTypes.object,
};
export default DatasetSelector;
