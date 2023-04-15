import {saveAs} from "file-saver";
import _ from "lodash";
import {makeAutoObservable, toJS} from "mobx";
import slugify from "slugify";

import {getHeaders, parseErrors, simulateClick} from "@/common";
import * as mc from "@/constants/mainConstants";

class MainStore {
    constructor(rootStore) {
        makeAutoObservable(this, {rootStore: false}, {autoBind: true});
        this.rootStore = rootStore;
    }

    config = {};
    models = {};

    analysis_name = "";
    analysis_description = "";
    model_type = mc.MODEL_CONTINUOUS;
    errorMessage = "";
    errorData = null;
    hasEditSettings = false;
    executionOutputs = null;
    isUpdateComplete = false;

    setConfig(config) {
        this.config = config;
    }
    changeAnalysisName(value) {
        this.analysis_name = value;
        this.setInputsChangedFlag();
    }
    changeAnalysisDescription(value) {
        this.analysis_description = value;
        this.setInputsChangedFlag();
    }
    changeDatasetType(value) {
        this.model_type = value;
        this.rootStore.modelsStore.setDefaultsByDatasetType(true);
        this.rootStore.optionsStore.setDefaultsByDatasetType(true);
        this.rootStore.dataStore.setDefaultsByDatasetType();
        this.rootStore.dataOptionStore.options = [];
        this.setInputsChangedFlag();
    }
    resetModelSelection() {
        this.rootStore.modelsStore.resetModelSelection();
    }

    get getOptions() {
        return this.rootStore.optionsStore.optionsList;
    }

    get getEnabledDatasets() {
        return this.rootStore.dataStore.getEnabledDatasets;
    }
    get getPayload() {
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

    async saveAnalysis() {
        this.rootStore.dataStore.cleanRows();
        const url = this.config.editSettings.patchInputUrl,
            {csrfToken} = this.config.editSettings;
        this.errorMessage = "";
        this.errorData = null;
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
                    response.json().then(errorText => {
                        const {errors, textErrors} = parseErrors(errorText);
                        this.errorMessage = textErrors.join(", ");
                        this.errorData = errors;
                    });
                }
            })
            .catch(error => {
                this.errorMessage = error;
            });
    }

    analysisSavedAndValidated = false;
    isExecuting = false;

    async executeAnalysis() {
        if (!this.analysisSavedAndValidated) {
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
    setInputsChangedFlag() {
        // inputs have changed and have not yet been saved or validated; prevent execution
        this.analysisSavedAndValidated = false;
    }
    updateModelStateFromApi(data) {
        if (data.errors.length > 0) {
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
        this.analysisSavedAndValidated = data.inputs_valid;
    }
    loadAnalysisFromFile(file) {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = e => {
            let settings = JSON.parse(e.target.result);
            /*
            Set `inputs_valid` to false to show that the data has not yet been saved and validated
            from the server. This is required so that even though you can view results in the
            user interface, you cannot download reports or other things from the server.
            */
            settings.inputs_valid = false;
            this.updateModelStateFromApi(settings);
        };
    }
    async saveAnalysisToFile() {
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

    get canEdit() {
        return this.config.editSettings !== undefined;
    }
    get isFuture() {
        return this.config.future;
    }
    get getExecutionOutputs() {
        return this.executionOutputs;
    }
    get getDatasets() {
        return this.rootStore.dataStore.getDatasets;
    }
    get getDatasetLength() {
        return this.rootStore.dataStore.getDataLength;
    }
    get getModelTypeName() {
        return _.find(mc.modelTypes, {value: this.model_type}).name;
    }
    get getModelTypeChoices() {
        let choices = mc.modelTypes.map((item, i) => {
            return {value: item.value, text: item.name};
        });
        if (!this.isFuture) {
            return choices.filter(
                d => d.value != mc.MODEL_NESTED_DICHOTOMOUS && d.value != mc.MODEL_MULTI_TUMOR
            );
        }
        return choices;
    }

    get getModels() {
        return this.rootStore.modelsStore.models;
    }

    get hasAtLeastOneModelSelected() {
        return (
            _.chain(this.getModels)
                .values()
                .map(d => d.length)
                .sum() > 0
        );
    }

    get hasAtLeastOneDatasetSelected() {
        return !_.isEmpty(this.getEnabledDatasets);
    }

    get hasAtLeastTwoDatasetsSelected() {
        return this.getEnabledDatasets.length >= 2;
    }

    get hasAtLeastOneOptionSelected() {
        return !_.isEmpty(this.getOptions);
    }

    get isValid() {
        if (this.model_type === mc.MODEL_MULTI_TUMOR) {
            return (
                this.hasAtLeastOneModelSelected &&
                this.hasAtLeastTwoDatasetsSelected &&
                this.hasAtLeastOneOptionSelected
            );
        }
        return (
            this.hasAtLeastOneModelSelected &&
            this.hasAtLeastOneDatasetSelected &&
            this.hasAtLeastOneOptionSelected
        );
    }
    get hasOutputs() {
        return _.isArray(this.executionOutputs);
    }

    get isMultiTumor() {
        return this.model_type === mc.MODEL_MULTI_TUMOR;
    }

    // *** TOAST ***
    toastVisible = false;
    toastHeader = "";
    toastMessage = "";
    downloadReport(url) {
        let apiUrl = (apiUrl = this.config[url]),
            params = {};
        if (this.canEdit) {
            params.editKey = this.config.editSettings.editKey;
        }
        if (url === "wordUrl") {
            _.extend(params, toJS(this.wordReportOptions));
        }
        const fetchReport = () => {
                fetch(apiUrl + "?" + new URLSearchParams(params).toString()).then(processResponse);
            },
            processResponse = response => {
                let contentType = response.headers.get("content-type");
                if (contentType.includes("application/json")) {
                    response.json().then(json => {
                        this.showToast(json.header, json.message);
                    });
                    setTimeout(fetchReport, 5000);
                } else {
                    const filename = response.headers
                        .get("content-disposition")
                        .match(/filename="(.*)"/)[1];
                    response.blob().then(blob => {
                        saveAs(blob, filename);
                        this.hideToast();
                    });
                }
            };
        fetchReport();
    }
    showToast(header, message) {
        this.toastHeader = header;
        this.toastMessage = message;
        this.toastVisible = true;
    }
    hideToast() {
        this.toastVisible = false;
        this.toastHeader = "";
        this.toastMessage = "";
    }
    // *** END TOAST ***

    // *** REPORT OPTIONS ***
    wordReportOptions = {
        datasetFormatLong: true,
        allModels: false,
        bmdCdfTable: false,
    };
    changeReportOptions(name, value) {
        this.wordReportOptions[name] = value;
    }
    displayWordReportOptionModal = false;
    showWordReportOptionModal() {
        this.displayWordReportOptionModal = true;
    }
    closeWordReportOptionModal() {
        this.displayWordReportOptionModal = false;
    }
    submitWordReportRequest() {
        this.closeWordReportOptionModal();
        this.downloadReport("wordUrl");
    }
    // *** END REPORT OPTIONS ***
}

export default MainStore;
