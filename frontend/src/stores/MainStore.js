import {observable, action, computed, toJS} from "mobx";
import _ from "lodash";
import rootStore from "./RootStore";

class MainStore {
    @observable config = {};
    @observable models = {};
    @observable prior_weight = 0;
    @observable prior_weight_models = [];
    @observable analysisForm = {
        analysis_name: "",
        analysis_description: "",
        dataset_type: "C",
    };
    @observable errorMessage = "";
    @observable errorModal = false;
    @observable hasEditSettings = false;
    @observable executionOutputs = null;
    @observable checked_items = [];
    @observable isUpdateComplete = false;
    @observable options = [];
    @observable CSOptionsList = [];
    @observable DIOptionsList = [];

    @action setConfig = config => {
        this.config = config;
    };

    @observable getEditSettings() {
        let editSettings = false;
        if ("editSettings" in this.config) {
            editSettings = true;
        }
        return editSettings;
    }

    @observable createOptions() {
        switch (this.analysisForm.dataset_type) {
            case "C":
                this.CSOptionsList.push(this.CSOptions);
                break;
            case "D":
                this.DIOptionsList.push(this.DIOptions);
                break;
        }
    }

    @action saveOptions = (name, value, id) => {
        this.options[id][name] = value;
    };

    @action deleteOptions = val => {
        if (this.analysisForm.dataset_type === "C") {
            this.CSOptionsList.splice(val, 1);
        } else if (this.analysisForm.dataset_type === "D") {
            this.DIOptionsList.splice(val, 1);
        }
    };

    @action addanalysisForm = (name, value) => {
        this.analysisForm[name] = value;
    };

    @observable getModelTypeList() {
        let models = [];
        if (this.analysisForm.dataset_type === "C") {
            models = this.CmodelType;
        } else if (this.analysisForm.dataset_type === "D") {
            models = this.DmodelType;
        }
        return models;
    }

    @action toggleModelsCheckBox = (selectedModel, checked, value) => {
        let models = this.getModelTypeList();
        if (selectedModel.split("-")[1] == "All") {
            this.modelsCheckBoxHeaders.third.values.map(value => {
                if (value.model_name == selectedModel.split("-")[0]) {
                    value.isChecked = !value.isChecked;
                    this.enableAllModels(models, selectedModel, value.isChecked);
                }
            });
        } else {
            models.map(item => {
                item.values.map(value => {
                    if (
                        value.name === selectedModel &&
                        !value.isDisabled &&
                        value.isChecked == !checked
                    ) {
                        value.isChecked = !value.isChecked;
                        this.checkAllEnabled(models, selectedModel);
                        if (selectedModel.split("-")[0] === "bayesian_model_average") {
                            if (checked) {
                                this.prior_weight_models.push(selectedModel);
                            } else {
                                let index = this.prior_weight_models.indexOf(selectedModel);
                                this.prior_weight_models.splice(index, 1);
                            }
                        }
                    }
                });
            });
        }

        if (this.prior_weight_models.length) {
            this.prior_weight = 100;
            this.prior_weight = this.prior_weight / this.prior_weight_models.length;
        }

        models.map(item => {
            item.values.map(val => {
                if (val.name.includes("bayesian_model_average")) {
                    if (this.prior_weight_models.includes(val.name)) {
                        val.prior_weight = this.prior_weight;
                    } else {
                        val.prior_weight = 0;
                    }
                }
            });
        });
    };

    @action enableAllModels(models, selectedModel, isChecked) {
        models.map(item => {
            item.values.map(value => {
                if (
                    value.name.split("-")[0] === selectedModel.split("-")[0] &&
                    !value.isDisabled &&
                    value.isChecked == !isChecked
                ) {
                    value.isChecked = !value.isChecked;
                    if (selectedModel.split("-")[0] == "bayesian_model_average") {
                        if (isChecked) {
                            this.prior_weight_models.push(value.name);
                        } else {
                            this.prior_weight_models = [];
                        }
                    }
                }
            });
        });
    }

    //checks if all models are enabled
    @action checkAllEnabled(models, modelName) {
        let totalModels = [];
        let enabledModels = [];
        models.map(model => {
            model.values.map(item => {
                if (item.name.split("-")[0] == modelName.split("-")[0] && !item.isDisabled) {
                    totalModels.push(item.name);
                }
                if (item.name.split("-")[0] == modelName.split("-")[0] && item.isChecked) {
                    enabledModels.push(item.name);
                }
                this.modelsCheckBoxHeaders.third.values.map(value => {
                    if (value.model_name == modelName.split("-")[0]) {
                        if (totalModels.length == enabledModels.length) {
                            value.isChecked = true;
                        } else {
                            value.isChecked = false;
                        }
                    }
                });
            });
        });
    }

    //returns enabled model types
    @computed get getModels() {
        let result = {};
        let models = toJS(this.getModelTypeList());

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

    @computed get getOptions() {
        let models = [];
        switch (this.analysisForm.dataset_type) {
            case "C":
                models = this.CSOptionsList;
                break;
            case "D":
                models = this.DIOptionsList;
                break;
        }
        return models;
    }
    @computed get getSelectedDataset() {
        let datasets = rootStore.dataStore.getDatasets();
        let enabledDatasets = datasets.filter(item => item.enabled == true);
        let selectedDatasets = enabledDatasets.filter(item =>
            item.model_type.includes(this.analysisForm.dataset_type)
        );
        return selectedDatasets;
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
                        analysis_name: this.analysisForm.analysis_name,
                        analysis_description: this.analysisForm.analysis_description,
                        dataset_type: this.analysisForm.dataset_type,
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
        this.analysisForm.analysis_name = inputs.analysis_name;
        this.analysisForm.analysis_description = inputs.analysis_description;
        this.analysisForm.dataset_type = inputs.dataset_type;
        this.options = inputs.options;
        this.setOptions(inputs.options, this.analysisForm.dataset_type);
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
            this.toggleModelsCheckBox(item, checked, value);
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
    @action getOptionsType(dataset_type) {
        let options = [];
        switch (dataset_type) {
            case "C":
                options = this.CSOptionsList;
                break;
            case "D":
                options = this.DIOptionsList;
                break;
        }
        return options;
    }

    @action setOptions(options, dataset_type) {
        switch (dataset_type) {
            case "C":
                this.CSOptionsList = options;
                break;
            case "D":
                this.DIOptionsList = options;
                break;
        }
    }
    @observable DIOptions = {
        bmr_type: "Extra",
        bmr_value: 0.05,
        confidence_level: 0.95,
        background: "Estimated",
    };

    @observable CSOptions = {
        bmr_type: "Std. Dev.",
        bmr_value: 0.05,
        tail_probability: 0.8,
        confidence_level: 0.95,
        distribution: "Normal",
        variance: "Constant",
        polynomial_restriction: "Use dataset adverse direction",
        background: "Estimated",
    };
    @observable DiHeader = ["Enable", "Datasets"];
    @observable CHeader = ["Enable", "Datasets", "Adverse Direction"];
    @observable AdverseDirectionList = [
        {value: "automatic", name: "Automatic"},
        {value: "up", name: "Up"},
        {value: "down", name: "Down"},
    ];

    @action getDatasetNamesHeader() {
        let datasetNames = [];
        switch (this.analysisForm.dataset_type) {
            case "C":
                datasetNames = this.CHeader;
                break;
            case "D":
                datasetNames = this.DiHeader;
                break;
        }
        return datasetNames;
    }

    @action getOptionsLabels(dataset_type) {
        let labels = [];
        switch (dataset_type) {
            case "C":
                labels = [
                    {label: "Option Set", name: "doses"},
                    {label: "BMR Type", name: "ns"},
                    {label: "BMRF", name: "means"},
                    {label: "Tail Probability", name: "stdevs"},
                    {label: "Confidence Level", name: "doses"},
                    {label: "Distribution", name: "ns"},
                    {label: "Variance", name: "means"},
                    {label: "Polynomial Restriction", name: "stdevs"},
                    {label: "Background", name: "doses"},
                ];
                break;
            case "D":
                labels = [
                    {label: "Option Set", name: "doses"},
                    {label: "Risk Type", name: "ns"},
                    {label: "BMR", name: "means"},
                    {label: "Confidence Level", name: "doses"},
                    {label: "Background", name: "doses"},
                ];
                break;
        }
        return labels;
    }

    @observable modelTypes = [
        {name: "Continuous", value: "C"},
        {name: "Dichotomous", value: "D"},
        {name: "Dichotomous-Multi-tumor (MS_Combo)", value: "DMT"},
        {name: "Dichotomous-Nested", value: "DN"},
    ];
    @observable CmodelType = [
        {
            model: "Exponential",
            values: [
                {
                    name: "frequentist_restricted-Exponential",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-Exponential",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "bayesian-Exponential",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian_model_average-Exponential",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Hill",
            values: [
                {
                    name: "frequentist_restricted-Hill",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-Hill",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {name: "bayesian-Hill", type: "checkbox", isChecked: false, isDisabled: false},
                {
                    name: "bayesian_model_average-Hill",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Linear",
            values: [
                {
                    name: "frequentist_restricted-Linear",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "frequentist_unrestricted-Linear",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {name: "bayesian-Linear", type: "checkbox", isChecked: false, isDisabled: false},
                {
                    name: "bayesian_model_average-Linear",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Polynomial",
            values: [
                {
                    name: "frequentist_restricted-Polynomial",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-Polynomial",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian-Polynomial",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian_model_average-Polynomial",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Power",
            values: [
                {
                    name: "frequentist_restricted-Power",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-Power",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {name: "bayesian-Power", type: "checkbox", isChecked: false, isDisabled: false},
                {
                    name: "bayesian_model_average-Power",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
    ];

    @observable DmodelType = [
        {
            model: "Dichotomous Hill",
            values: [
                {
                    name: "frequentist_restricted-DichotomousHill",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-DichotomousHill",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian-DichotomousHill",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian_model_average-DichotomousHill",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Gamma",
            values: [
                {
                    name: "frequentist_restricted-Gamma",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-Gamma",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {name: "bayesian-Gamma", type: "checkbox", isChecked: false, isDisabled: false},
                {
                    name: "bayesian_model_average-Gamma",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Logistic",
            values: [
                {
                    name: "frequentist_restricted-Logistic",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "frequentist_unrestricted-Logistic",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {name: "bayesian-Logistic", type: "checkbox", isChecked: false, isDisabled: false},
                {
                    name: "bayesian_model_average-Logistic",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Log Logistic",
            values: [
                {
                    name: "frequentist_restricted-LogLogistic",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-LogLogistic",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian-LogLogistic",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian_model_average-LogLogistic",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Log Probit",
            values: [
                {
                    name: "frequentist_restricted-LogProbit",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-LogProbit",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {name: "bayesian-LogProbit", type: "checkbox", isChecked: false, isDisabled: false},
                {
                    name: "bayesian_model_average-LogProbit",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Multistage",
            values: [
                {
                    name: "frequentist_restricted-Multistage",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-Multistage",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian-Multistage",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian_model_average-Multistage",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Probit",
            values: [
                {
                    name: "frequentist_restricted-Probit",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "frequentist_unrestricted-Probit",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {name: "bayesian-Probit", type: "checkbox", isChecked: false, isDisabled: false},
                {
                    name: "bayesian_model_average-Probit",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Quantal Linear",
            values: [
                {
                    name: "frequentist_restricted-QuantalLinear",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "frequentist_unrestricted-QuantalLinear",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian-QuantalLinear",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian_model_average-QuantalLinear",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Weibull",
            values: [
                {
                    name: "frequentist_restricted-Weibull",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-Weibull",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {name: "bayesian-Weibull", type: "checkbox", isChecked: false, isDisabled: false},
                {
                    name: "bayesian_model_average-Weibull",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
    ];
    @observable modelsCheckBoxHeaders = {
        first: {
            model: "",
            values: [
                {name: "MLE", colspan: "2"},
                {name: "Alternatives", colspan: "2"},
            ],
        },
        second: {
            model: "",
            values: [
                {name: "Frequntist Restricted", colspan: "1"},
                {name: "Frequentist Unrestricted", colspan: "1"},
                {name: "Bayesian", colspan: "1"},
                {name: "Bayesian Model Average", colspan: "1"},
            ],
        },
        third: {
            model: "Model Name",
            values: [
                {
                    name: "Enable",
                    model_name: "frequentist_restricted",
                    colspan: "1",
                    type: "checkBox",
                    isChecked: false,
                },
                {
                    name: "Enable",
                    model_name: "frequentist_unrestricted",
                    colspan: "1",
                    type: "checkBox",
                    isChecked: false,
                },
                {
                    name: "Enable",
                    model_name: "bayesian",
                    colspan: "1",
                    type: "checkBox",
                    isChecked: false,
                },
                {
                    name: "Enable",
                    model_name: "bayesian_model_average",
                    colspan: "1",
                    type: "checkBox",
                    isChecked: false,
                    prior_weight: "Prior Weight",
                },
            ],
        },
    };
}

const mainStore = new MainStore();
export default mainStore;
