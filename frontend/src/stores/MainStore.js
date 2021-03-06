import {saveAs} from "file-saver";
import slugify from "slugify";
import {observable, action, computed} from "mobx";
import _ from "lodash";

import * as mc from "../constants/mainConstants";
import {simulateClick, getHeaders} from "../common";

class MainStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable config = {};
    @observable models = {};

    @observable analysis_name = "";
    @observable analysis_description = "";
    @observable model_type = mc.MODEL_CONTINUOUS;
    @observable errorMessage = "";
    @observable hasEditSettings = false;
    @observable executionOutputs = null;
    @observable isUpdateComplete = false;

    @action.bound setConfig(config) {
        this.config = config;
    }
    @action.bound changeAnalysisName(value) {
        this.analysis_name = value;
    }
    @action.bound changeAnalysisDescription(value) {
        this.analysis_description = value;
    }
    @action.bound changeDatasetType(value) {
        this.model_type = value;
        this.rootStore.modelsStore.setDefaultsByDatasetType(true);
        this.rootStore.optionsStore.setDefaultsByDatasetType(true);
        this.rootStore.dataStore.setDefaultsByDatasetType();
        this.rootStore.dataOptionStore.options = [];
    }

    @computed get getOptions() {
        return this.rootStore.optionsStore.optionsList;
    }

    @computed get getEnabledDatasets() {
        return this.rootStore.dataStore.getEnabledDatasets;
    }
    @computed get getPayload() {
        const editKey = this.config.editSettings ? this.config.editSettings.editKey : null;
        return {
            editKey,
            partial: true,
            data: {
                bmds_version: mc.VERSION_330,
                analysis_name: this.analysis_name,
                analysis_description: this.analysis_description,
                dataset_type: this.model_type,
                models: this.rootStore.modelsStore.models,
                datasets: this.rootStore.dataStore.datasets,
                dataset_options: this.rootStore.dataOptionStore.options,
                options: this.getOptions,
                recommender: this.rootStore.logicStore.logic,
            },
        };
    }

    @action.bound
    async saveAnalysis() {
        const url = this.config.editSettings.patchInputUrl,
            {csrfToken} = this.config.editSettings;
        this.errorMessage = "";
        await fetch(url, {
            method: "PATCH",
            mode: "cors",
            headers: getHeaders(csrfToken),
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

    @action.bound
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

        const apiUrl = this.config.apiUrl,
            {csrfToken} = this.config.editSettings,
            handleServerError = error => {
                console.error("error", error);
                if (error.status == 500) {
                    this.errorMessage =
                        "A server error occurred... if the error continues or your analysis does not complete please contact us.";
                    return;
                }
                this.errorMessage = error;
            },
            pollForResults = () => {
                fetch(apiUrl, {
                    method: "GET",
                    mode: "cors",
                })
                    .then(response => {
                        if (!response.ok) {
                            throw response;
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.is_executing) {
                            setTimeout(pollForResults, 5000);
                        } else {
                            this.updateModelStateFromApi(data);
                            simulateClick(document.getElementById("navlink-output"));
                        }
                    })
                    .catch(handleServerError);
            };

        await fetch(this.config.editSettings.executeUrl, {
            method: "POST",
            mode: "cors",
            headers: getHeaders(csrfToken),
            body: JSON.stringify({
                editKey: this.config.editSettings.editKey,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then(data => {
                if (data.is_executing) {
                    setTimeout(pollForResults, 5000);
                } else {
                    this.updateModelStateFromApi(data);
                    simulateClick(document.getElementById("navlink-output"));
                }
            })
            .catch(handleServerError);
    }
    @action.bound
    async executeResetAnalysis() {
        const {csrfToken, executeResetUrl} = this.config.editSettings;
        await fetch(executeResetUrl, {
            method: "POST",
            mode: "cors",
            headers: getHeaders(csrfToken),
            body: JSON.stringify({
                editKey: this.config.editSettings.editKey,
            }),
        })
            .then(response => response.json())
            .then(data => {
                this.isExecuting = false;
                this.errorMessage = "";
                this.updateModelStateFromApi(data);
            })
            .catch(error => {
                this.errorMessage = error;
                console.error("error", error);
            });
    }
    @action.bound
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
            this.changeDatasetType(this.model_type);
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
        this.model_type = inputs.dataset_type;
        this.changeDatasetType(this.model_type);
        this.rootStore.optionsStore.setOptions(inputs.options);
        this.rootStore.dataStore.setDatasets(inputs.datasets);
        this.rootStore.dataOptionStore.setDatasetOptions(inputs.dataset_options);
        this.rootStore.modelsStore.setModels(inputs.models);
        this.rootStore.logicStore.setLogic(inputs.recommender);
        this.isUpdateComplete = true;
    }
    @action.bound loadAnalysisFromFile(file) {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = e => {
            let settings = JSON.parse(e.target.result);
            this.updateModelStateFromApi(settings);
        };
    }
    @action.bound async saveAnalysisToFile() {
        const apiUrl = this.config.apiUrl;
        await fetch(apiUrl, {
            method: "GET",
            mode: "cors",
        })
            .then(response => response.json())
            .then(json => {
                const fn = json.inputs.analysis_name ? slugify(json.inputs.analysis_name) : json.id,
                    file = new File([JSON.stringify(json, null, 2)], `${fn}.json`, {
                        type: "application/json",
                    });
                saveAs(file);
            });
    }

    @computed get canEdit() {
        return this.config.editSettings !== undefined;
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
    @computed get getModelTypeName() {
        return _.find(mc.modelTypes, {value: this.model_type}).name;
    }

    @computed get getModels() {
        return this.rootStore.modelsStore.models;
    }

    @computed get hasAtLeastOneModelSelected() {
        return !_.isEmpty(this.getModels);
    }

    @computed get hasAtLeastOneDatasetSelected() {
        return !_.isEmpty(this.getEnabledDatasets);
    }

    @computed get hasAtLeastOneOptionSelected() {
        return !_.isEmpty(this.getOptions);
    }

    @computed get isValid() {
        return (
            this.hasAtLeastOneModelSelected &&
            this.hasAtLeastOneDatasetSelected &&
            this.hasAtLeastOneOptionSelected
        );
    }
    @computed get hasOutputs() {
        return this.executionOutputs !== null;
    }

    // *** TOAST ***
    @observable showToast = false;
    @observable toastHeader = "";
    @observable toastMessage = "";
    @action.bound downloadReport(url) {
        const apiUrl = this.config[url],
            fetchReport = () => {
                fetch(apiUrl).then(processResponse);
            },
            processResponse = response => {
                let contentType = response.headers.get("content-type");
                if (contentType.includes("application/json")) {
                    response.json().then(json => {
                        this.toastHeader = json.header;
                        this.toastMessage = json.message;
                    });
                    this.showToast = true;
                    setTimeout(fetchReport, 5000);
                } else {
                    const filename = response.headers
                        .get("content-disposition")
                        .match(/filename="(.*)"/)[1];
                    response.blob().then(blob => {
                        saveAs(blob, filename);
                        this.showToast = false;
                    });
                }
            };
        fetchReport();
    }
    @action.bound closeToast() {
        this.showToast = false;
    }
    // *** END TOAST ***
}

export default MainStore;
