import {observable, action, computed} from "mobx";
import * as constant from "../constants/dataConstants";

class DataStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable model_type = "CS";
    @observable datasets = [];
    @observable selectedDatasetIndex = "";

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

    @action saveDatasetName(name) {
        this.getCurrentDatasets["dataset_name"] = name;
    }

    @action addDataset(e) {
        e.preventDefault();
        let form = constant.datasetForm[this.model_type];
        if (this.getDatasetType === "DM") {
            form["degree"] = "auto-select";
            form["background"] = "Estimated";
        }
        form["enabled"] = false;
        form["model_type"] = this.model_type;
        form["dataset_id"] = this.datasets.length;
        form["dataset_name"] = "DatasetName " + form["dataset_id"];
        form["column_names"] = constant.columnNames[this.model_type];
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

    @action saveDataset = (name, value, id, dataset_id) => {
        if (isNaN(value)) {
            this.datasets[dataset_id][name] = value;
        } else {
            this.datasets[dataset_id][name][id] = value;
        }
    };
    @action changeColumnName = (name, value, dataset_id) => {
        this.datasets[dataset_id]["column_names"][name] = value;
    };

    @action deleteDataset() {
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
    @action toggleDataset = dataset_id => {
        var obj = this.datasets.find(item => item.dataset_id == dataset_id);
        obj["enabled"] = !obj["enabled"];
    };
    @action changeDatasetProperties = (name, value, id) => {
        this.datasets.map(item => {
            if (item.dataset_id == id) {
                item[name] = value;
            }
        });
    };
    @action setDatasets(inputs) {
        this.datasets = inputs.datasets;
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
        let ns = dataset.ns;
        let incidences = dataset.incidences;
        if (dataset.model_type === "CS") {
            responses = dataset.means;
        } else if (dataset.model_type === "DM") {
            for (var i = 0; i < ns.length; i++) {
                var response = incidences[i] / ns[i];
                responses.push(response);
            }
        }
        return responses;
    }
    @computed get getLayout() {
        return constant.scatter_plot_layout;
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
        return constant.modelTypes.filter(model => model.value.includes(this.getDatasetType));
    }
    @computed get getModelTypesName() {
        return constant.modelTypes.find(item => item.value === this.model_type);
    }

    @computed get getDatasetType() {
        return this.rootStore.mainStore.dataset_type;
    }

    @computed get getLabels() {
        return constant.labels[this.getCurrentDatasets.model_type];
    }

    @computed get getEnabledDatasets() {
        let enabledDatasets = this.datasets.filter(item => item.enabled == true);
        let datasetofModelType = enabledDatasets.filter(item =>
            item.model_type.includes(this.getDatasetType)
        );
        return datasetofModelType;
    }

    @computed get getDatasetNamesHeader() {
        return constant.datasetNamesHeaders[this.getDatasetType];
    }
    @computed get getAdverseDirectionList() {
        return constant.AdverseDirectionList;
    }
    @computed get getDegree() {
        return constant.degree;
    }
    @computed get getBackground() {
        return constant.background;
    }
}

export default DataStore;
