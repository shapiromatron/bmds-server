import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("dataStore")
@observer
class DatasetSelector extends Component {
    render() {
        const {dataStore} = this.props;
        return (
            <div className="nav flex-column nav-fill nav-pills nav-stacked">
                {dataStore.datasets.map(dataset => {
                    return (
                        <a
                            key={dataset.dataset_id}
                            className={
                                dataset.dataset_id === dataStore.selectedDatasetIndex
                                    ? "nav-link active"
                                    : "nav-link"
                            }
                            data-toggle="pill"
                            href="#"
                            role="tab"
                            aria-selected="true"
                            onClick={e => {
                                e.preventDefault();
                                dataStore.setCurrentDatasetIndex(dataset.dataset_id);
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
