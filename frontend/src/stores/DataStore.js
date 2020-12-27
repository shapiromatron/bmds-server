import {observable, action, computed, toJS} from "mobx";
import _ from "lodash";

import * as mc from "../constants/mainConstants";
import * as dc from "../constants/dataConstants";
import {
    datasetTypesByModelType,
    columns,
    columnNames,
    datasetForm,
    scatter_plot_layout,
    yAxisTitle,
    model_type,
} from "../constants/dataConstants";

class DataStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable model_type = "DM";
    @observable datasets = [];
    @observable selectedDatasetIndex = null;
    @observable selectedFile = {};

    @action.bound setDefaultsByDatasetType() {
        let datasetTypes = this.getFilteredDatasetTypes;
        this.model_type = datasetTypes[0].value;
        this.datasets = [];
    }

    @action.bound setModelType(model_type) {
        this.model_type = model_type;
    }

    @action.bound setSelectedDatasetIndex(dataset_id) {
        this.selectedDatasetIndex = dataset_id;
    }

    @action.bound saveDatasetName(key, value) {
        this.selectedDataset[key] = value;
    }

    @action.bound addDataset() {
        let form = datasetForm[this.model_type];
        if (this.getModelType === mc.MODEL_DICHOTOMOUS) {
            form["degree"] = "auto-select";
            form["background"] = "Estimated";
        }
        form["enabled"] = true;
        form["model_type"] = this.model_type;
        form["dataset_id"] = this.datasets.length;
        form["dataset_name"] = `Dataset #${this.datasets.length + 1}`;
        form["column_names"] = columnNames[this.model_type];
        this.selectedDatasetIndex = form["dataset_id"];
        this.datasets.push(form);
    }

    @action.bound addRows() {
        Object.keys(this.selectedDataset).map((key, i) => {
            if (Array.isArray(this.selectedDataset[key])) {
                this.selectedDataset[key].push("");
            }
        });
    }

    @action.bound deleteRow = (dataset_id, index) => {
        let dataset = this.datasets[dataset_id];
        Object.keys(dataset).map(key => {
            if (Array.isArray(dataset[key])) {
                dataset[key].splice(index, 1);
            }
        });
    };

    @action.bound saveDatasetCellItem(key, value, dataset_id, index) {
        let parsedValue = "";
        if (key === "ns") {
            parsedValue = parseInt(value);
        } else {
            parsedValue = parseFloat(value);
        }
        if (_.isNumber(parsedValue)) {
            this.datasets[dataset_id][key][index] = parsedValue;
        }
    }

    @action.bound changeColumnName(name, value) {
        this.selectedDataset.column_names[name] = value;
    }

    @action.bound deleteDataset() {
        var index = this.datasets.findIndex(item => item.dataset_id == this.selectedDatasetIndex);
        if (index > -1) {
            this.datasets.splice(index, 1);
        }
        if (this.datasets.length) {
            let idArray = [];
            this.datasets.map(dataset => {
                idArray.push(dataset.dataset_id);
            });
            this.selectedDatasetIndex = idArray[0];
        }
    }

    @action.bound toggleDataset(key, value, dataset_id) {
        this.datasets.find(dataset => dataset.dataset_id == dataset_id)[key] = value;
    }

    @action setDatasets(datasets) {
        this.datasets = datasets;
        this.datasets.map(item => {
            this.selectedDatasetIndex = item.dataset_id;
        });
    }

    @computed get selectedDataset() {
        return this.datasets.find(item => item.dataset_id == this.selectedDatasetIndex);
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
        let plotData = [];
        let dataset = this.selectedDataset;
        var trace1 = {
            x: dataset.doses.slice(),
            y: this.getResponse.slice(),
            mode: "markers",
            type: "scatter",
            name: "Response",
        };
        plotData.push(trace1);
        return plotData;
    }

    @computed get getResponse() {
        let responses = [];
        let dataset = this.selectedDataset;
        if (dataset.model_type === dc.DATA_CONTINUOUS_SUMMARY) {
            responses = dataset.means;
        } else if (dataset.model_type === dc.DATA_CONTINUOUS_INDIVIDUAL) {
            responses = dataset.responses;
        } else if (dataset.model_type === dc.DATA_DICHOTOMOUS) {
            let ns = dataset.ns;
            let incidences = dataset.incidences;
            for (var i = 0; i < ns.length; i++) {
                let response = incidences[i] / ns[i];
                responses.push(response);
            }
        } else if (dataset.model_type === model_type.Nested) {
            let incidences = dataset.incidences;
            let litter_sizes = dataset.litter_sizes;
            for (var j = 0; j < litter_sizes.length; j++) {
                let response = incidences[j] / litter_sizes[j];
                responses.push(response);
            }
        }
        return responses;
    }

    @computed get getLayout() {
        let dataset = this.selectedDataset,
            model_type = this.selectedDataset.model_type,
            layout = _.cloneDeep(scatter_plot_layout),
            ylabel = yAxisTitle[model_type];

        layout.title.text = dataset.dataset_name;
        layout.xaxis.title.text = dataset.column_names["doses"];
        layout.yaxis.title.text = dataset.column_names[ylabel];

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

    @computed get getDatasetColumns() {
        return columns[this.model_type];
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
        return this.selectedDatasetIndex !== null;
    }
}

export default DataStore;
