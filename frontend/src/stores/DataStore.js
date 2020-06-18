import {observable, action, computed} from "mobx";
import rootStore from "./RootStore";
import {toJS} from "mobx";

class DataStore {
    @observable model_type = "CS";
    @observable datasets = [];

    @observable selectedDatasetIndex = "";
    @observable currentDataset = {};
    @observable currentDatasetLabels = [];

    @action setCurrentDatasetIndex(dataset_id) {
        this.selectedDatasetIndex = dataset_id;
    }

    @action addDataset(e) {
        e.preventDefault();
        let form = this.getDatasetForm();
        form["enabled"] = false;
        form["adverse_direction"] = "automatic";
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

    @action getDatasetLabels(model_type) {
        let labels = [];
        switch (model_type) {
            case "CS":
                labels = ["Dose", "St.Dev", "Mean", "St Dev"];
                break;
            case "CI":
                labels = ["Dose", "Response"];
                break;
            case "D":
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
                    doses: [1, 2, 3, 4, 5],
                    ns: [6, 7, 8, 9, 10],
                    means: [6, 7, 8, 9, 10],
                    stdevs: [6, 7, 8, 9, 10],
                };
                break;
            case "CI":
                form = {
                    doses: ["", "", "", "", ""],
                    responses: ["", "", "", "", ""],
                };
                break;
            case "D":
                form = {
                    doses: [1, 2, 3, 4, 5],
                    ns: [6, 7, 8, 9, 10],
                    incidences: [1, 2, 3, 4, 5],
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
                    stdevs: "Std. Dev.",
                };
                break;
            case "CI":
                form = {
                    doses: "Dose",
                    responses: "Response",
                };
                break;
            case "D":
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

    @observable DatasetNamesHeader = ["Enable", "Datasets", "Adverse Direction"];
    @observable AdverseDirectionList = [
        {value: "automatic", name: "Automatic"},
        {value: "up", name: "Up"},
        {value: "down", name: "Down"},
    ];
    @observable ModelTypes = [
        {value: "CS", name: "Continuous Summarized"},
        {value: "CI", name: "Continuous Individual"},
        {value: "D", name: "Dichotomous"},
        {value: "N", name: "Nested"},
    ];
}

const dataStore = new DataStore();
export default dataStore;
