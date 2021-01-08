import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("dataStore")
@observer
class DatasetSelector extends Component {
    render() {
        const {dataStore, store} = this.props;
        return (
            <div className="nav flex-column nav-fill nav-pills nav-stacked mt-2">
                {dataStore.datasets.map(dataset => {
                    return (
                        <a
                            key={dataset.metadata.id}
                            className={
                                dataset.metadata.id === store.selectedDatasetId
                                    ? "nav-link btn-sm active"
                                    : "nav-link btn-sm"
                            }
                            data-toggle="pill"
                            href="#"
                            role="tab"
                            aria-selected="true"
                            onClick={e => {
                                e.preventDefault();
                                store.setSelectedDataset(dataset);
                            }}>
                            {dataset.metadata.name}
                        </a>
                    );
                })}
            </div>
        );
    }
}
DatasetSelector.propTypes = {
    dataStore: PropTypes.object,
    store: PropTypes.object,
};
export default DatasetSelector;
