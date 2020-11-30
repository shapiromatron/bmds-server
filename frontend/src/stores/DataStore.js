import {observable, action, computed} from "mobx";
import _ from "lodash";
import {
    labels,
    modelTypes,
    columnNames,
    datasetForm,
    datasetNamesHeaders,
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
    @observable selectedDatasetIndex = "";
    @observable selectedFile = {};

    @action.bound importDatasets(file) {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = e => {
            let settings = JSON.parse(e.target.result);
            this.datasets = settings.inputs.datasets;
        };
    }

    @action setDefaultsByDatasetType() {
        let modelTypes = this.getFilteredModelTypes;
        this.model_type = modelTypes[0].value;
        this.datasets = [];
    }

    @action setModelType(model_type) {
        this.model_type = model_type;
    }
    @action setCurrentDatasetIndex(dataset_id) {
        this.selectedDatasetIndex = dataset_id;
        this.rootStore.outputStore.setCurrentDatasetIndex(this.selectedDatasetIndex);
    }

    @action saveDatasetName(key, value) {
        this.getCurrentDatasets[key] = value;
    }

    @action addDataset() {
        let form = datasetForm[this.model_type];
        if (this.getDatasetType === "DM") {
            form["degree"] = "auto-select";
            form["background"] = "Estimated";
        }
        form["enabled"] = true;
        form["model_type"] = this.model_type;
        form["dataset_id"] = this.datasets.length;
        form["dataset_name"] = "DatasetName " + form["dataset_id"];
        form["column_names"] = columnNames[this.model_type];
        this.selectedDatasetIndex = form["dataset_id"];
        this.datasets.push(form);
    }

    @action addRows() {
        Object.keys(this.getCurrentDatasets).map((key, i) => {
            if (Array.isArray(this.getCurrentDatasets[key])) {
                this.getCurrentDatasets[key].push("");
            }
        });
    }

    @action deleteRow = (dataset_id, index) => {
        let dataset = this.datasets[dataset_id];
        Object.keys(dataset).map(key => {
            if (Array.isArray(dataset[key])) {
                dataset[key].splice(index, 1);
            }
        });
    };

    @action.bound saveDataset(key, value, dataset_id, index) {
        let parsedValue = "";
        if (key === "ns") {
            parsedValue = parseInt(value);
        } else {
            parsedValue = parseFloat(value);
        }
        this.datasets[dataset_id][key][index] = parsedValue;
    }

    @action.bound changeColumnName(name, value) {
        this.datasets[this.getCurrentDatasets.dataset_id]["column_names"][name] = value;
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
    @computed get getCurrentDatasets() {
        return this.datasets.find(item => item.dataset_id == this.selectedDatasetIndex);
    }

    @computed get getMappedArray() {
        let datasetInputForm = [];
        Object.keys(this.getCurrentDatasets).map(key => {
            if (Array.isArray(this.getCurrentDatasets[key])) {
                this.getCurrentDatasets[key].map((val, i) => {
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

    @computed get getScatterPlotData() {
        let plotData = [];
        let dataset = this.getCurrentDatasets;
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
        let dataset = this.getCurrentDatasets;
        if (dataset.model_type === model_type.Continuous_Summarized) {
            responses = dataset.means;
        } else if (dataset.model_type === model_type.Continuous_Individual) {
            responses = dataset.responses;
        } else if (dataset.model_type === model_type.Dichotomous) {
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
        let model_type = this.getCurrentDatasets.model_type;
        let layout = _.cloneDeep(scatter_plot_layout);
        let ylabel = yAxisTitle[model_type];
        layout.title.text = this.getCurrentDatasets.dataset_name;
        layout.xaxis.title.text = this.getCurrentDatasets.column_names["doses"];
        layout.yaxis.title.text = this.getCurrentDatasets.column_names[ylabel];
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
        return this.datasets.filter(item => item.model_type.includes(this.getDatasetType));
    }

    @computed get getFilteredModelTypes() {
        return modelTypes.filter(model => model.value.includes(this.getDatasetType));
    }
    @computed get getModelTypesName() {
        return modelTypes.find(item => item.value === this.model_type);
    }

    @computed get getDatasetType() {
        return this.rootStore.mainStore.dataset_type;
    }

    @computed get getLabels() {
        return labels[this.getCurrentDatasets.model_type];
    }

    @computed get getEnabledDatasets() {
        return this.datasets.filter(
            item => item.enabled == true && item.model_type.includes(this.getDatasetType)
        );
    }

    @computed get getDatasetNamesHeader() {
        return datasetNamesHeaders[this.getDatasetType];
    }

    @computed get checkDatasetsLength() {
        if (this.datasets.length > 9) {
            return true;
        }
        return false;
    }
}

export default DataStore;
