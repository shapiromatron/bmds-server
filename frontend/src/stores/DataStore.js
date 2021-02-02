import {observable, action, computed, toJS} from "mobx";
import _ from "lodash";

import * as dc from "../constants/dataConstants";
import {getDrLayout, getDrDatasetPlotData} from "../constants/plotting";
import {datasetTypesByModelType, getDefaultDataset} from "../constants/dataConstants";

class DataStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable model_type = dc.DATA_CONTINUOUS_SUMMARY;
    @observable datasets = [];
    @observable selectedDatasetId = null;
    @observable showModal = false;
    @observable modalDatasets = "";
    @observable modalValidatedDatasets = [];
    @observable modalError = "";
    @observable modalDataValidated = false;

    @action.bound setDefaultsByDatasetType() {
        this.selectedDatasetId = null;
        this.datasets = [];
        this.model_type = this.getFilteredDatasetTypes[0].value;
    }

    @action.bound setModelType(model_type) {
        this.model_type = model_type;
    }

    @action.bound setSelectedDataset(dataset) {
        this.selectedDatasetId = dataset.metadata.id;
    }

    @action.bound setDatasetMetadata(key, value) {
        this.selectedDataset.metadata[key] = value;
    }

    @action.bound addDataset() {
        const dataset = getDefaultDataset(this.model_type),
            id =
                _.chain(this.datasets)
                    .map(d => d.metadata.id)
                    .max()
                    .defaultTo(-1)
                    .value() + 1;

        dataset.metadata.id = id;
        dataset.metadata.name = `Dataset #${id + 1}`;
        this.datasets.push(dataset);
        this.rootStore.dataOptionStore.createOption(dataset);
        this.selectedDatasetId = id;
    }

    @action.bound addRow() {
        const dataset = this.selectedDataset;
        Object.keys(dataset).map((key, i) => {
            if (Array.isArray(dataset[key])) {
                dataset[key].push("");
            }
        });
    }

    @action.bound deleteRow = index => {
        const dataset = this.selectedDataset;
        Object.keys(dataset).map(key => {
            if (Array.isArray(dataset[key])) {
                dataset[key].splice(index, 1);
            }
        });
    };

    @action.bound saveDatasetCellItem(key, value, rowIdx) {
        let dataset = this.selectedDataset,
            parsedValue = "";
        if (key === "ns") {
            parsedValue = parseInt(value);
        } else {
            parsedValue = parseFloat(value);
        }
        if (_.isNumber(parsedValue)) {
            dataset[key][rowIdx] = parsedValue;
        }
    }

    @action.bound changeColumnName(name, value) {
        this.selectedDataset.column_names[name] = value;
    }

    @action.bound deleteDataset() {
        var index = this.datasets.findIndex(item => item.metadata.id == this.selectedDatasetId),
            datasetId = toJS(this.selectedDatasetId);
        if (index > -1) {
            this.datasets.splice(index, 1);
            this.rootStore.dataOptionStore.deleteOption(datasetId);
        }
        this.selectedDatasetId = null;
        if (this.datasets.length > 0) {
            this.selectedDatasetId = this.datasets[this.datasets.length - 1].metadata.id;
        }
    }

    @action setDatasets(datasets) {
        this.datasets = datasets;
        this.selectedDatasetId = datasets.length > 0 ? datasets[0].metadata.id : null;
    }

    @action toggleDatasetModal() {
        this.showModal = !this.showModal;
        this.modalError = "";
    }
    @action closeDatasetModal() {
        this.showModal = false;
    }

    @action changeDatasetFromModal(dataset) {
        this.modalDataValidated = false;
        this.modalDatasets = dataset;
    }

    @action validateModalDataset() {
        this.modalValidatedDatasets = [];
        let modalDataset = this.modalDatasets.split("\n");

        //remove any empty lines
        _.remove(modalDataset, function(n) {
            return n.length <= 1;
        });
        modalDataset.map(item => {
            let line = item.split("\t");
            if (line.length != dc.datasetColumnLength[this.model_type]) {
                this.modalError =
                    dc.datasetTypes[this.model_type] +
                    " datasets must have exactly " +
                    dc.datasetColumnLength[this.model_type] +
                    " columns of data.";
                return;
            }
            let result = line.map(function(e) {
                return isNaN(e);
            });
            if (result.includes(true)) {
                this.modalError =
                    "Copy/paste data from Excel into the box below. Data must be all numeric with no headers or descriptive columns.";
                return;
            }

            this.modalValidatedDatasets.push(line);
            this.modalError = "";
            this.modalDataValidated = true;
        });
    }
    @action saveDatasetFromModal() {
        //make array  as per columns
        let dataset_columns = _.zip(...this.modalValidatedDatasets);

        let dataset = getDefaultDataset(this.model_type);
        Object.keys(dataset).map((key, index) => {
            if (Array.isArray(dataset[key])) {
                dataset[key] = dataset_columns[index - 2];
            }
        });
        let id =
            _.chain(this.datasets)
                .map(d => d.metadata.id)
                .max()
                .defaultTo(-1)
                .value() + 1;

        dataset.metadata.id = id;
        dataset.metadata.name = `Dataset #${id + 1}`;
        this.datasets.push(dataset);
        this.rootStore.dataOptionStore.createOption(dataset);
        this.selectedDatasetId = id;
        this.toggleDatasetModal();
    }

    @computed get isModalDataValidated() {
        return this.modalDataValidated;
    }

    @computed get selectedDataset() {
        return this.datasets.find(item => item.metadata.id === this.selectedDatasetId);
    }

    @computed get getMappedArray() {
        let datasetInputForm = [],
            dataset = this.selectedDataset;
        Object.keys(dataset).map(key => {
            if (Array.isArray(dataset[key])) {
                dataset[key].map((val, i) => {
                    if (!datasetInputForm[i]) {
                        datasetInputForm.push({[key]: val});
                    } else {
                        datasetInputForm[i][key] = val;
                    }
                });
            }
        });
        return datasetInputForm;
    }

    @computed get drPlotLayout() {
        return getDrLayout(this.selectedDataset);
    }

    @computed get drPlotData() {
        const dataset = this.selectedDataset;
        return [getDrDatasetPlotData(dataset)];
    }

    @computed get getDatasets() {
        return this.datasets;
    }

    @computed get getDataLength() {
        return this.datasets.length;
    }

    @computed get canEdit() {
        return this.rootStore.mainStore.canEdit;
    }

    @computed get getExecutionOutputs() {
        return this.rootStore.mainStore.getExecutionOutputs;
    }

    @computed get getModelTypeDatasets() {
        return this.datasets.filter(item => item.model_type.includes(this.getModelType));
    }

    @computed get getFilteredDatasetTypes() {
        return datasetTypesByModelType(toJS(this.getModelType));
    }

    @computed get getModelType() {
        return this.rootStore.mainStore.model_type;
    }

    @computed get getEnabledDatasets() {
        return this.rootStore.dataOptionStore.options
            .filter(d => d.enabled === true)
            .map(d => d.dataset);
    }

    @computed get checkDatasetsLength() {
        if (this.datasets.length > 9) {
            return true;
        }
        return false;
    }

    @computed get hasSelectedDataset() {
        return this.selectedDatasetId !== null;
    }

    @computed get openDatasetModal() {
        return this.openModal;
    }
}

export default DataStore;
