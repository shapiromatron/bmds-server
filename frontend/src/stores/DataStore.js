import {observable, action, computed} from "mobx";
import rootStore from "./RootStore";

class DataStore {
    @observable model_type = "CS";
    @observable datasets = [];

    @observable selectedDatasetIndex = "";
    @observable currentDataset = {};
    @observable currentDatasetLabels = [];

    @action setModelType(model_type) {
        this.model_type = model_type;
    }
    @action setCurrentDatasetIndex(dataset_id) {
        this.selectedDatasetIndex = dataset_id;
        rootStore.outputStore.setCurrentDatasetIndex(this.selectedDatasetIndex);
    }

    @action addDataset(e) {
        e.preventDefault();
        let form = this.getDatasetForm();
        form["enabled"] = false;
        form["dataset_description"] = "";
        form["model_type"] = this.model_type;
        form["dataset_id"] = this.datasets.length;
        form["dataset_name"] = "DatasetName " + form["dataset_id"];
        form["column_names"] = this.getColumnNames();
        this.selectedDatasetIndex = form["dataset_id"];
        this.datasets.push(form);
    }

    @action getCurrentDataset(index) {
        return this.datasets.find(item => item.dataset_id == index);
    }

    @action getMappedArray(dataset) {
        let datasetForm = [];
        Object.keys(dataset).map((key, i) => {
            if (Array.isArray(dataset[key])) {
                dataset[key].map((val, i) => {
                    if (!datasetForm[i]) {
                        datasetForm.push({[key]: val});
                    } else {
                        datasetForm[i][key] = val;
                    }
                });
            }
        });
        return datasetForm;
    }
    @action addRows = dataset => {
        Object.keys(dataset).map((key, i) => {
            if (Array.isArray(dataset[key])) {
                dataset[key].push("");
            }
        });
    };
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
    @action saveAdverseDirection = (name, value, id) => {
        this.datasets.map((item, i) => {
            if (item.dataset_id == id) {
                item[name] = value;
            }
        });
    };
    @action setDatasets(datasets) {
        this.datasets = datasets;
        this.datasets.map(item => {
            this.selectedDatasetIndex = item.dataset_id;
            return;
        });
    }
    @action setPlotData(index) {
        switch (this.model_type) {
            case "CS":
                this.getCSScatterPlot(index);
                break;
            case "DM":
                this.getDMScatterPlot(index);
                break;
            default:
                break;
        }
    }
    @observable plotData = [];
    @action getCSScatterPlot(index) {
        let currentDataset = this.getCurrentDataset(index);
        this.plotData = [];
        let doses = currentDataset.doses;
        let mean = currentDataset.means;
        let stdevs = currentDataset.stdevs;
        let ns = currentDataset.ns;
        let errorbars = [];
        for (var i = 0; i < stdevs.length; i++) {
            var value = stdevs[i] / Math.sqrt(ns[i]);
            errorbars.push(value);
        }
        var trace1 = {
            x: doses,
            y: mean,
            error_y: {
                type: "data",
                array: errorbars,
                visible: true,
            },
            mode: "markers",
            type: "scatter",
            name: "Response",
        };
        this.plotData.push(trace1);
    }

    @action getDMScatterPlot(index) {
        let currentDataset = this.getCurrentDataset(index);
        this.plotData = [];
        let doses = currentDataset.doses;
        let incidences = currentDataset.incidences;
        let ns = currentDataset.ns;
        let responses = [];
        for (var i = 0; i < ns.length; i++) {
            var response = incidences[i] / ns[i];
            responses.push(response);
        }
        var trace1 = {
            x: doses,
            y: responses,
            mode: "markers+lines",
            type: "scatter",
            name: "Response",
        };
        this.plotData.push(trace1);
    }
    @observable layout = {
        showlegend: true,
        title: {
            text: "Scatter Plot",
            font: {
                family: "Courier New, monospace",
                size: 12,
            },
            xref: "paper",
        },
        xaxis: {
            title: {
                text: "Dose (mg/kg-day)",
                font: {
                    family: "Courier New, monospace",
                    size: 14,
                    color: "#7f7f7f",
                },
            },
        },
        yaxis: {
            title: {
                text: "Response (mg/dL)",
                font: {
                    family: "Courier New, monospace",
                    size: 14,
                    color: "#7f7f7f",
                },
            },
        },
    };

    @action addFitCurve(trace2) {
        if (this.plotData.length > 1) {
            this.plotData.pop();
        }
        this.plotData.push(trace2);
    }

    @action getDatasets() {
        return this.datasets;
    }

    @action getEnabledDatasets() {
        return this.datasets.filter(item => item.enabled == true);
    }

    //returns the dataset which are enabled
    @computed get getEnabledDataset() {
        let dataset = this.datasets.filter(item => item.enabled == true);
        return dataset;
    }

    @computed get getDataLength() {
        return this.datasets.length;
    }

    @action getEditSettings() {
        return rootStore.mainStore.getEditSettings();
    }
    @action getExecutionOutputs() {
        let outputs = rootStore.mainStore.getExecutionOutputs();
        return outputs;
    }

    @action getModelTypeDatasets() {
        return this.datasets.filter(item =>
            item.model_type.includes(rootStore.mainStore.dataset_type)
        );
    }
    @action getMappingDataset(dataset) {
        let datasetInputForm = [];
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

    @action getSelectedDatasets() {
        let dataset_type = rootStore.mainStore.dataset_type;
        let selectedDataset = this.datasets.filter(item => item.model_type.includes(dataset_type));
        return selectedDataset;
    }

    @action getFilteredModelTypes() {
        let dataset_types = rootStore.mainStore.dataset_type;
        let modeltype_list = this.ModelTypes.filter(model => model.value.includes(dataset_types));
        this.model_type = modeltype_list[0].value;
        return modeltype_list;
    }
    @action getDatasetLabels(model_type) {
        let labels = [];
        switch (model_type) {
            case "CS":
                labels = ["Dose", "N", "Mean", "St Dev"];
                break;
            case "CI":
                labels = ["Dose", "Response"];
                break;
            case "DM":
                labels = ["Dose", "N", "Incidence"];
                break;
            case "N":
                labels = ["Dose", "Litter Size", "Incidence", "Litter Specific Covariate"];
                break;
        }
        return labels;
    }
    @action getDatasetForm() {
        let form = {};
        switch (this.model_type) {
            case "CS":
                form = {
                    doses: [0, 7, 37, 186],
                    ns: [25, 25, 25, 24],
                    means: [55.8, 52.9, 64.8, 119.9],
                    stdevs: [12.5, 15.4, 17.4, 32.5],
                    adverse_direction: "automatic",
                };
                break;
            case "CI":
                form = {
                    doses: ["", "", "", "", ""],
                    responses: ["", "", "", "", ""],
                };
                break;
            case "DM":
                form = {
                    doses: [0, 0.46, 1.39, 4.17, 12.5],
                    ns: [9, 9, 11, 10, 7],
                    incidences: [0, 0, 3, 2, 3],
                };
                break;
            case "N":
                form = {
                    doses: ["", "", "", "", ""],
                    litter_sizes: ["", "", "", "", ""],
                    incidences: ["", "", "", "", ""],
                    litter_specific_covariates: ["", "", "", "", ""],
                };

                break;
        }
        return form;
    }

    @action getColumnNames() {
        let form = {};
        switch (this.model_type) {
            case "CS":
                form = {
                    doses: "Dose",
                    ns: "N",
                    means: "Mean",
                    stdevs: "St. Dev.",
                };
                break;
            case "CI":
                form = {
                    doses: "Dose",
                    responses: "Response",
                };
                break;
            case "DM":
                form = {
                    doses: "Dose",
                    ns: "N",
                    incidences: "Incidence",
                };
                break;
            case "N":
                form = {
                    doses: "Dose",
                    litter_sizes: "LItter Size",
                    incidences: "Incidence",
                    litter_specific_covariates: "Litter Specific Covariate",
                };

                break;
        }
        return form;
    }
    @observable ModelTypes = [
        {value: "CS", name: "Continuous Summarized"},
        {value: "CI", name: "Continuous Individual"},
        {value: "DM", name: "Dichotomous"},
        {value: "N", name: "Nested"},
    ];
}

const dataStore = new DataStore();
export default dataStore;
