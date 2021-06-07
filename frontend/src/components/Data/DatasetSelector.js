import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("dataStore")
@observer
class DatasetSelector extends Component {
    render() {
        const {dataStore, store} = this.props;
        return (
            <div className="mt-2">
                <select
                    id="dataset-type"
                    className="form-control"
                    onChange={e => store.setSelectedDataset(parseInt(e.target.value))}
                    value={store.selectedDatasetId}>
                    {dataStore.datasets.map(dataset => {
                        return (
                            <option key={dataset.metadata.id} value={dataset.metadata.id}>
                                {dataset.metadata.name}
                            </option>
                        );
                    })}
                </select>
            </div>
        );
    }
}
DatasetSelector.propTypes = {
    dataStore: PropTypes.object,
    store: PropTypes.object,
};
export default DatasetSelector;
