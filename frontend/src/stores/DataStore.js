import {observable, action, computed, toJS} from "mobx";
import _ from "lodash";

import * as mc from "../constants/mainConstants";
import * as dc from "../constants/dataConstants";
import {
    datasetTypesByModelType,
    getDefaultDataset,
    scatter_plot_layout,
    model_type,
    getDoseLabel,
    getResponseLabel,
} from "../constants/dataConstants";

class DataStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable model_type = dc.DATA_CONTINUOUS_SUMMARY;
    @observable datasets = [];
    @observable selectedDatasetId = null;

    @action.bound setDefaultsByDatasetType() {
        let datasetTypes = this.getFilteredDatasetTypes;
        this.model_type = datasetTypes[0].value;
        this.datasets = [];
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

        // TODO - remove this stuff or put somewhere else?
        if (this.getModelType === mc.MODEL_DICHOTOMOUS) {
            dataset["degree"] = "auto-select";
            dataset["background"] = "Estimated";
        }
        dataset["enabled"] = true;
        dataset["model_type"] = this.model_type;
        // end TODO

        this.datasets.push(dataset);
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
        var index = this.datasets.findIndex(item => item.metadata.id == this.selectedDatasetId);
        if (index > -1) {
            this.datasets.splice(index, 1);
        }
        this.selectedDatasetId = null;
        if (this.datasets.length > 0) {
            this.selectedDatasetId = this.datasets[this.datasets.length - 1].metadata.id;
        }
    }

    @action.bound changeDatasetAttribute(dataset_id, key, value) {
        let dataset = this.datasets.find(dataset => dataset.metadata.id == dataset_id);
        dataset[key] = value;
    }

    @action setDatasets(datasets) {
        this.datasets = datasets;
        this.selectedDatasetId = datasets.length > 0 ? datasets[0].metadata.id : null;
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

    @computed get getDoseResponseData() {
        const dataset = this.selectedDataset;
        return [
            {
                x: dataset.doses.slice(),
                y: this.getResponse.slice(),
                mode: "markers",
                type: "scatter",
                name: "Response",
            },
        ];
    }

    @computed get getResponse() {
        let dataset = this.selectedDataset,
            incidences,
            ns;

        switch (dataset.model_type) {
            case dc.DATA_CONTINUOUS_SUMMARY:
                return dataset.means;
            case dc.DATA_CONTINUOUS_INDIVIDUAL:
                return dataset.responses;
            case dc.DATA_DICHOTOMOUS:
                ns = dataset.ns;
                incidences = dataset.incidences;
                return _.range(ns.length).map(idx => incidences[idx] / ns[idx]);
            case model_type.Nested:
                incidences = dataset.incidences;
                ns = dataset.litter_sizes;
                return _.range(ns.length).map(idx => incidences[idx] / ns[idx]);
            default:
                throw "Unknown model_type";
        }
    }

    @computed get getLayout() {
        let dataset = this.selectedDataset,
            layout = _.cloneDeep(scatter_plot_layout);

        layout.title.text = dataset.metadata.name;
        layout.xaxis.title.text = getDoseLabel(dataset);
        layout.yaxis.title.text = getResponseLabel(dataset);

        return layout;
    }

    @computed get getDatasets() {
        return this.datasets;
    }

    @computed get getDataLength() {
        return this.datasets.length;
    }

    @computed get getEditSettings() {
        return this.rootStore.mainStore.getEditSettings;
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
        return this.datasets.filter(
            item => item.enabled == true && item.model_type.includes(this.getModelType)
        );
    }

    @computed get getDatasetNamesHeader() {
        return mc.datasetNamesHeaders[this.getModelType];
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
}

export default DataStore;
