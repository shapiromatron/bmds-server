import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import DatasetModelOption from "./DatasetModelOption";
import DatasetModelOptionReadOnly from "./DatasetModelOptionReadOnly";
import PropTypes from "prop-types";
import {toJS} from "mobx";

@inject("dataStore")
@observer
class DatasetList extends Component {
    render() {
        const {dataStore} = this.props,
            datasets = toJS(dataStore.datasets);

        return (
            <table className="table table-bordered table-sm">
                <thead>
                    <tr className="table-primary">
                        {dataStore.getDatasetNamesHeader.map((item, i) => {
                            return <th key={i}>{item}</th>;
                        })}
                    </tr>
                </thead>
                {dataStore.getEditSettings ? (
                    <tbody>
                        {datasets.map(dataset => {
                            return (
                                <DatasetModelOption
                                    key={dataset.metadata.id}
                                    dataset={dataset}
                                    handleChange={dataStore.changeDatasetAttribute}
                                    model_type={dataStore.getModelType}
                                />
                            );
                        })}
                    </tbody>
                ) : (
                    <tbody>
                        {dataStore.datasets.map(dataset => {
                            return (
                                <DatasetModelOptionReadOnly
                                    key={dataset.metadata.id}
                                    dataset={dataset}
                                    model_type={dataStore.getModelType}
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
