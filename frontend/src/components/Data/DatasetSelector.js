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
                            key={dataset.dataset_id}
                            className={
                                dataset.dataset_id === store.selectedDatasetIndex
                                    ? "nav-link btn-sm active"
                                    : "nav-link btn-sm"
                            }
                            data-toggle="pill"
                            href="#"
                            role="tab"
                            aria-selected="true"
                            onClick={e => {
                                e.preventDefault();
                                store.setSelectedDatasetIndex(dataset.dataset_id);
                            }}>
                            {dataset.dataset_name}
                        </a>
                    );
                })}
            </div>
        );
    }
}
DatasetSelector.propTypes = {
    dataStore: PropTypes.object,
};
export default DatasetSelector;
