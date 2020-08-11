import {observable, action, computed} from "mobx";
import _ from "lodash";
import rootStore from "./RootStore";
import * as constant from "../constants/mainConstants";

class MainStore {
    @observable config = {};
    @observable models = {};

    @observable analysis_name = "";
    @observable analysis_description = "";
    @observable dataset_type = "C";
    @observable errorMessage = "";
    @observable errorModal = false;
    @observable hasEditSettings = false;
    @observable executionOutputs = null;
    @observable checked_items = [];
    @observable isUpdateComplete = false;

    @action setConfig = config => {
        this.config = config;
    };
    @action changeAnalysisName(value) {
        this.analysis_name = value;
    }
    @action changeAnalysisDescription(value) {
        this.analysis_description = value;
    }
    @action changeDatasetType(value) {
        this.dataset_type = value;
        rootStore.optionsStore.dataset_type = this.dataset_type;
        rootStore.modelsStore.dataset_type = this.dataset_type;
    }

    @observable getEditSettings() {
        let editSettings = false;
        if ("editSettings" in this.config) {
            editSettings = true;
        }
        return editSettings;
    }

    //returns enabled model types
    @computed get getModels() {
        let result = {};
        let models = rootStore.modelsStore.getModels;

        models.map(item => {
            item.values.map(val => {
                if (val.isChecked) {
                    var [k, v] = val.name.split("-");
                    if (v === "DichotomousHill") {
                        v = "Dichotomous-Hill";
                    }
                    if (k in result) {
                        if (k === "bayesian_model_average") {
                            result[k] = result[k].concat({
                                model: v,
                                prior_weight: parseFloat(val.prior_weight) / 100,
                            });
                        } else {
                            result[k] = result[k].concat(v);
                        }
                    } else {
                        if (k === "bayesian_model_average") {
                            result[k] = [
                                {model: v, prior_weight: parseFloat(val.prior_weight) / 100},
                            ];
                        } else {
                            result[k] = [v];
                        }
                    }
                }
            });
        });

        return result;
    }

    @computed get getSelectedDataset() {
        let datasets = rootStore.dataStore.getDatasets();
        let enabledDatasets = datasets.filter(item => item.enabled == true);
        let selectedDatasets = enabledDatasets.filter(item =>
            item.model_type.includes(this.dataset_type)
        );
        return selectedDatasets;
    }
    @computed get getOptions() {
        return rootStore.optionsStore.optionsList;
    }

    @action
    async saveAnalysis() {
        const url = this.config.editSettings.patchInputUrl,
            getPayload = () => {
                return {
                    editKey: this.config.editSettings.editKey,
                    partial: true,
                    data: {
                        bmds_version: "BMDS312",
                        analysis_name: this.analysis_name,
                        analysis_description: this.analysis_description,
                        dataset_type: this.dataset_type,
                        models: this.getModels,
                        datasets: this.getSelectedDataset,
                        options: this.getOptions,
                    },
                };
            };

        await fetch(url, {
            method: "PATCH",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(getPayload()),
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(data => this.updateModelStateFromApi(data));
                } else {
                    this.errorModal = !this.errorModal;
                    response.json().then(data => (this.errorMessage = data));
                }
            })
            .catch(error => {
                this.errorModal = !this.errorModal;
                this.errorMessage = error;
            });
    }

    @observable isReadyToExecute = false;
    @observable isExecuting = false;
    @action
    async executeAnalysis() {
        if (!this.isReadyToExecute) {
            // don't execute if we're not ready
            return;
        }
        if (this.isExecuting) {
            // don't execute if we're already executing
            return;
        }
        this.isExecuting = true;
        await fetch(this.config.editSettings.executeUrl, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                editKey: this.config.editSettings.editKey,
            }),
        })
            .then(response => response.json())
            .then(data => {
                // TODO - fix this when we don't block and execution doesn't complete immediately
                this.updateModelStateFromApi(data);
            })
            .catch(error => {
                console.error("error", error);
            });
    }

    @action
    async fetchSavedAnalysis() {
        const apiUrl = this.config.apiUrl;
        await fetch(apiUrl, {
            method: "GET",
            mode: "cors",
        })
            .then(response => response.json())
            .then(data => this.updateModelStateFromApi(data))
            .catch(error => {
                console.error("error", error);
            });
    }
    @action.bound
    updateModelStateFromApi(data) {
        if (data.errors.length > 2) {
            this.errorModal = !this.errorModal;
            this.errorMessage = data.errors;
            this.isUpdateComplete = true;
        }

        const inputs = data.inputs;
        if (_.isEmpty(inputs)) {
            this.isUpdateComplete = true;
            return;
        }

        this.isExecuting = data.is_executing;
        this.isReadyToExecute = data.inputs_valid;
        if (data.outputs) {
            this.executionOutputs = data.outputs.outputs;
        }
        // unpack general settings
        this.analysis_name = inputs.analysis_name;
        this.analysis_description = inputs.analysis_description;
        this.dataset_type = inputs.dataset_type;

        rootStore.optionsStore.optionsList = inputs.options;
        // unpack datasets
        var datasets = inputs.datasets;
        rootStore.dataStore.setDatasets(datasets);

        // unpack selected models
        let modelArr = [];
        Object.keys(inputs.models).map((item, i) => {
            inputs.models[item].map((val, index) => {
                if (item === "bayesian_model_average") {
                    val = val.model;
                }
                if (val == "Dichotomous-Hill") {
                    let [k, v] = val.split("-");
                    val = k + v;
                }
                val = item + "-" + val;
                modelArr.push(val);
            });
        });
        modelArr.forEach((item, i) => {
            let checked = true;
            let value = "";
            rootStore.modelsStore.toggleModelsCheckBox(item, checked, value);
        });

        this.isUpdateComplete = true;
    }

    @action toggleDataset = id => {
        rootStore.dataStore.toggleDataset(id);
    };

    @action saveAdverseDirection = (name, value, id) => {
        rootStore.dataStore.saveAdverseDirection(name, value, id);
    };
    @action getExecutionOutputs() {
        return this.executionOutputs;
    }

    @action getDatasets() {
        return rootStore.dataStore.getDatasets();
    }

    @action toggleDataset(dataset_id) {
        rootStore.dataStore.toggleDataset(dataset_id);
    }
    @action saveAdverseDiretion = (name, value, id) => {
        rootStore.dataStore.saveAdverseDirection(name, value, id);
    };
    @action getEnabledDatasets() {
        return rootStore.dataStore.datasets.filter(item => item.enabled == true);
    }
    @action getDatasetLength() {
        return rootStore.dataStore.getDataLength;
    }

    @action getDatasetNamesHeader() {
        return constant.datasetNamesHeaders[this.dataset_type];
    }
    @action getAdverseDirectionList() {
        return constant.AdverseDirectionList;
    }
    @action getDegree() {
        return constant.degree;
    }
    @action getBackground() {
        return constant.background;
    }
    @action getModelTypes() {
        return constant.modelTypes;
    }
}

const mainStore = new MainStore();
export default mainStore;
