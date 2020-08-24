import {observable, action, computed} from "mobx";
import _ from "lodash";
import * as constant from "../constants/mainConstants";

class MainStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable config = {};
    @observable models = {};

    @observable analysis_name = "";
    @observable analysis_description = "";
    @observable dataset_type = "C";
    @observable errorMessage = "";
    @observable errorModal = false;
    @observable hasEditSettings = false;
    @observable executionOutputs = null;
    @observable isUpdateComplete = false;

    @action hideModal() {
        this.errorModal = !this.errorModal;
    }
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
        this.rootStore.modelsStore.setDefaultsByDatasetType();
        this.rootStore.optionsStore.setDefaultsByDatasetType();
        this.rootStore.dataStore.setDefaultsByDatasetType();
    }
    @action.bound toggleDataset(id) {
        this.rootStore.dataStore.toggleDataset(id);
    }

    @action.bound saveAdverseDirection(name, value, id) {
        this.rootStore.dataStore.saveAdverseDirection(name, value, id);
    }

    @computed get getOptions() {
        return this.rootStore.optionsStore.optionsList;
    }
    @computed get getEnabledModels() {
        return this.rootStore.modelsStore.getEnabledModels;
    }
    @computed get getEnabledDatasets() {
        return this.rootStore.dataStore.getEnabledDatasets;
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
                        models: this.getEnabledModels,
                        datasets: this.getEnabledDatasets,
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

        this.rootStore.optionsStore.setOptions(inputs);
        this.rootStore.dataStore.setDatasets(inputs);
        this.rootStore.modelsStore.setModels(inputs);
        this.isUpdateComplete = true;
    }

    @computed get getEditSettings() {
        let editSettings = false;
        if ("editSettings" in this.config) {
            editSettings = true;
        }
        return editSettings;
    }

    @computed get getExecutionOutputs() {
        return this.executionOutputs;
    }

    @computed get getDatasets() {
        return this.rootStore.dataStore.getDatasets;
    }
    @computed get getDatasetLength() {
        return this.rootStore.dataStore.getDataLength;
    }

    @computed get getDatasetNamesHeader() {
        return constant.datasetNamesHeaders[this.dataset_type];
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
    @computed get getModelTypes() {
        return constant.modelTypes;
    }
    @computed get getDatasetTypeName() {
        return this.getModelTypes.find(item => item.value == this.dataset_type);
    }
}

export default MainStore;
