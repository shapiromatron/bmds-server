import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import Datasets from "./Datasets";
import DatasetsReadOnly from "./DatasetsReadOnly";
import PropTypes from "prop-types";
import {toJS} from "mobx";

@inject("dataStore")
@observer
class DatasetList extends Component {
    render() {
        const {dataStore} = this.props,
            datasets = toJS(dataStore.datasets);
        return (
            <table className="table table-bordered table-sm  datasetlist-table">
                <thead>
                    <tr className="table-primary">
                        {dataStore.getDatasetNamesHeader.map((item, i) => {
                            return <th key={i}>{item}</th>;
                        })}
                    </tr>
                </thead>
                {dataStore.getEditSettings ? (
                    <tbody>
                        {datasets.map((dataset, index) => {
                            return (
                                <Datasets
                                    key={index}
                                    dataset={dataset}
                                    toggleDataset={dataStore.toggleDataset}
                                    changeDatasetProperties={dataStore.changeDatasetProperties}
                                    adverseList={dataStore.getAdverseDirectionList}
                                    degree={dataStore.getDegree}
                                    background={dataStore.getBackground}
                                    dataset_type={dataStore.getDatasetType}
                                />
                            );
                        })}
                    </tbody>
                ) : (
                    <tbody>
                        {dataStore.datasets.map((dataset, index) => {
                            return (
                                <DatasetsReadOnly
                                    key={index}
                                    dataset={dataset}
                                    dataset_type={dataStore.getDatasetType}
                                />
                            );
                        })}
                    </tbody>
                )}
            </table>
        );
    }
}
DatasetList.propTypes = {
    dataStore: PropTypes.object,
    getDataLength: PropTypes.func,
    getDatasetNamesHeader: PropTypes.string,
    getEditSettings: PropTypes.func,
    getDatasets: PropTypes.string,
};
export default DatasetList;
