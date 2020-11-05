import {observable, action, computed} from "mobx";
import _ from "lodash";
import {modelTypes} from "../constants/mainConstants";

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
    @observable hasEditSettings = false;
    @observable executionOutputs = null;
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
        this.rootStore.modelsStore.setDefaultsByDatasetType();
        this.rootStore.optionsStore.setDefaultsByDatasetType();
        this.rootStore.dataStore.setDefaultsByDatasetType();
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
    @computed get getLogic() {
        return this.rootStore.logicStore.getLogic;
    }
    @computed get getPayload() {
        const editKey = this.config.editSettings ? this.config.editSettings.editKey : null;
        return {
            editKey,
            partial: true,
            data: {
                bmds_version: "BMDS330",
                analysis_name: this.analysis_name,
                analysis_description: this.analysis_description,
                dataset_type: this.dataset_type,
                models: this.getEnabledModels,
                datasets: this.getEnabledDatasets,
                options: this.getOptions,
                logic: this.getLogic,
            },
        };
    }

    @action
    async saveAnalysis() {
        const url = this.config.editSettings.patchInputUrl;
        this.errorMessage = "";
        await fetch(url, {
            method: "PATCH",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.getPayload),
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(data => this.updateModelStateFromApi(data));
                } else {
                    response.json().then(data => (this.errorMessage = data));
                }
            })
            .catch(error => {
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
        this.errorMessage = "";
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
                this.errorMessage = error;
                console.error("error", error);
            });
    }
    @action
    async fetchSavedAnalysis() {
        const apiUrl = this.config.apiUrl;
        this.errorMessage = "";
        await fetch(apiUrl, {
            method: "GET",
            mode: "cors",
        })
            .then(response => response.json())
            .then(data => this.updateModelStateFromApi(data))
            .catch(error => {
                this.errorMessage = error;
                console.error("error", error);
            });
    }
    @action.bound
    updateModelStateFromApi(data) {
        if (data.errors.length > 2) {
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
        this.rootStore.optionsStore.setOptions(inputs.options);
        this.rootStore.dataStore.setDatasets(inputs.datasets);
        this.rootStore.modelsStore.setModels(inputs.models);
        this.rootStore.logicStore.setLogic(inputs);
        this.isUpdateComplete = true;
    }
    @action.bound loadAnalysis(file) {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = e => {
            let settings = JSON.parse(e.target.result);
            this.hydrateInputs(settings);
            this.hydrateOutputs(settings);
        };
    }
    @action hydrateInputs(settings) {
        this.rootStore.dataStore.setDatasets(settings.inputs.datasets);
        this.rootStore.optionsStore.setOptions(settings.inputs.options);
        this.rootStore.modelsStore.setModels(settings.inputs.models);
    }
    @action hydrateOutputs(settings) {
        if (!settings.outputs) {
            return;
        }
        this.executionOutputs = settings.outputs.outputs;
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
    @computed get getDatasetTypeName() {
        return modelTypes.find(item => item.value == this.dataset_type);
    }
}

export default MainStore;
