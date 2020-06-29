import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import Datasets from "./Datasets";
import DatasetsReadOnly from "./DatasetsReadOnly";

@inject("mainStore")
@observer
class DatasetList extends Component {
    render() {
        const {mainStore} = this.props,
            toggleDataset = (e, dataset_id) => {
                mainStore.toggleDataset(dataset_id);
            },
            onChange = (e, dataset_id) => {
                mainStore.saveAdverseDirection(e.target.name, e.target.value, dataset_id);
            },
            isEditSettings = mainStore.getEditSettings(),
            adverseList = mainStore.AdverseDirectionList,
            datasets = mainStore.getDatasets(),
            enabledDatasets = datasets.filter(item => item.enabled == true),
            selectedDatasets = datasets.filter(item =>
                item.model_type.includes(mainStore.analysisForm.dataset_type)
            ),
            datasetnames = mainStore.getDatasetNamesHeader();
        return (
            <div className="table-responsive ">
                {mainStore.getDatasetLength ? (
                    <table className="table table-bordered  datasetlist-table">
                        <thead>
                            <tr className="table-primary">
                                {datasetnames.map((item, i) => {
                                    return [<th key={i}>{item}</th>];
                                })}
                            </tr>
                        </thead>
                        {isEditSettings ? (
                            <Datasets
                                datasets={selectedDatasets}
                                adverseList={adverseList}
                                dataset_type={mainStore.analysisForm.dataset_type}
                                enabledDatasets={enabledDatasets}
                                onChange={onChange.bind(this)}
                                toggleDatasets={toggleDataset.bind(this)}
                            />
                        ) : (
                            <DatasetsReadOnly datasets={datasets} />
                        )}
                    </table>
                ) : null}
            </div>
        );
    }
}

export default DatasetList;
