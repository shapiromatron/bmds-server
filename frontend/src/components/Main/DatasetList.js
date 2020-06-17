import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import Datasets from "./Datasets";
import DatasetsReadOnly from "./DatasetsReadOnly";

@inject("dataStore")
@observer
class DatasetList extends Component {
    render() {
        const {dataStore} = this.props,
            toggleDataset = (e, dataset_id) => {
                dataStore.toggleDataset(dataset_id);
            },
            onChange = (e, dataset_id) => {
                dataStore.saveAdverseDirection(e.target.name, e.target.value, dataset_id);
            },
            isEditSettings = dataStore.getEditSettings(),
            adverseList = dataStore.AdverseDirectionList,
            enabledDatasets = dataStore.datasets.filter(item => item.enabled == true);
        return (
            <div>
                {dataStore.getDataLength > 0 ? (
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                {dataStore.DatasetNamesHeader.map((item, i) => {
                                    return [<th key={i}>{item}</th>];
                                })}
                            </tr>
                        </thead>
                        {isEditSettings ? (
                            <Datasets
                                datasets={dataStore.datasets}
                                adverseList={adverseList}
                                enabledDatasets={enabledDatasets}
                                onChange={onChange.bind(this)}
                                toggleDatasets={toggleDataset.bind(this)}
                            />
                        ) : (
                            <DatasetsReadOnly datasets={dataStore.datasets} />
                        )}
                    </table>
                ) : null}
            </div>
        );
    }
}

export default DatasetList;
