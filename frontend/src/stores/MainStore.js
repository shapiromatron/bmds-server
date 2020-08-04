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

    @action saveOptions = (name, value, id) => {
        this.options[id][name] = value;
    };

    @action deleteOptions = val => {
        this.options.splice(val, 1);
    };

    @action addanalysisForm = (name, value) => {
        if (name === "dataset_type") {
            this.options = [];
            rootStore.dataStore.datasets = [];
            let modelsList = this.getModelTypeList();
            modelsList.map(models => {
                models.values.map(val => {
                    if (val.isChecked) {
                        val.isChecked = !val.isChecked;
                    }
                });
            });
            this.modelsCheckBoxHeaders.third.values.map(value => {
                if (value.isChecked) {
                    value.isChecked = !value.isChecked;
                }
            });
        }
        this.analysisForm[name] = value;
    };

    @observable getModelTypeList() {
        let models = [];
        if (this.analysisForm.dataset_type === "C") {
            models = this.CmodelType;
        } else if (this.analysisForm.dataset_type === "D") {
            models = this.DmodelType;
        } else if (this.analysisForm.dataset_type === "N") {
            models = this.NmodelType;
        }
        return models;
    }

    @observable getmodelsHeaders() {
        let modelsHeader = {};
        if (this.analysisForm.dataset_type === "N") {
            modelsHeader = this.NestedCheckBoxHeaders;
        } else {
            modelsHeader = this.modelsCheckBoxHeaders;
        }
        return modelsHeader;
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
                        options: this.options,
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
        this.analysisForm.analysis_name = inputs.analysis_name;
        this.analysisForm.analysis_description = inputs.analysis_description;
        this.analysisForm.dataset_type = inputs.dataset_type;
        this.options = inputs.options;
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

    @action getDatasetNamesHeader() {
        let datasetNames = [];
        switch (this.analysisForm.dataset_type) {
            case "C":
                datasetNames = ["Enable", "Datasets", "Adverse Direction"];
                break;
            case "D":
                datasetNames = ["Enable", "Datasets"];
                break;
            case "DM":
                datasetNames = ["Enable", "Datasets", "Degree", "Background"];
                break;
            case "N":
                datasetNames = ["Enable", "Datasets"];
                break;
        }
        return datasetNames;
    }

    @observable createOptions() {
        let option = this.getOptions(this.analysisForm.dataset_type);
        this.options.push(option);
    }
    @action getOptions(dataset_type) {
        let options = {};
        switch (dataset_type) {
            case "C":
                options = this.CSOptions;
                break;
            case "D":
                options = this.DIOptions;
                break;
            case "DM":
                options = this.DMTOptions;
                break;
            case "N":
                options = this.NOptions;
                break;
        }
        return options;
    }

    @action getOptionsLabels(dataset_type) {
        let labels = [];
        switch (dataset_type) {
            case "C":
                labels = [
                    "Option Set",
                    "BMR Type",
                    "BMRF",
                    "Tail Probability",
                    "Confidence Level",
                    "Distribution",
                    "Variance",
                    "Polynomial Restriction",
                    "Background",
                ];
                break;
            case "D":
                labels = ["Option Set", "Risk Type", "BMR", "Confidence Level", "Background"];
                break;
            case "DM":
                labels = ["Option Set", "Risk Type", "BMR", "Confidence Level"];
                break;
            case "N":
                labels = [
                    "Option Set",
                    "Risk Type",
                    "BMR",
                    "Confidence Level",
                    "Litter Specific Covariate",
                    "Background",
                    "Bootstrap Iterations",
                    "Bootstrap Seed",
                ];
                break;
        }
        return labels;
    }
    @observable DIOptions = {
        bmr_type: "Extra",
        bmr_value: 0.1,
        confidence_level: 0.95,
        background: "Estimated",
    };

    @observable CSOptions = {
        bmr_type: "Std. Dev.",
        bmr_value: 1,
        tail_probability: 0.01,
        confidence_level: 0.95,
        distribution: "Normal",
        variance: "Constant",
        polynomial_restriction: "Use dataset adverse direction",
        background: "Estimated",
    };
    @observable NOptions = {
        bmr_type: "Extra",
        bmr_value: 0.1,
        confidence_level: 0.95,
        litter_sepcific_covariate: "Overall Mean",
        background: "Estimated",
        bootstrap_iterations: 1000,
        bootstrap_speed: "Automatic",
    };
    @observable DMTOptions = {
        bmr_type: "Extra",
        bmr_value: 0.1,
        confidence_level: 0.95,
    };
    @observable AdverseDirectionList = [
        {value: "automatic", name: "Automatic"},
        {value: "up", name: "Up"},
        {value: "down", name: "Down"},
    ];
    @observable degree = [
        {value: "auto-select", name: "auto-select"},
        {value: "1", name: "1"},
        {value: "2", name: "2"},
        {value: "3", name: "3"},
    ];
    @observable background = [
        {value: "Estimated", name: "Esimated"},
        {value: "0", name: "Zero"},
    ];

    @observable modelTypes = [
        {name: "Continuous", value: "C"},
        {name: "Dichotomous", value: "D"},
        {name: "Dichotomous-Multi-tumor (MS_Combo)", value: "DM"},
        {name: "Dichotomous-Nested", value: "N"},
    ];
    @observable NmodelType = [
        {
            model: "Nested Logistic",
            values: [
                {
                    name: "frequentist_restricted-Nested_Logistic",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-Nested_Logistic",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
            ],
        },
        {
            model: "NCTR",
            values: [
                {
                    name: "frequentist_restricted-NCTR",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "frequentist_unrestricted-NCTR",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: true,
                },
            ],
        },
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

    @observable NestedCheckBoxHeaders = {
        first: {
            model: "",
            values: [{name: "MLE", colspan: "2"}],
        },
        second: {
            model: "",
            values: [
                {name: "Frequntist Restricted", colspan: "1"},
                {name: "Frequentist Unrestricted", colspan: "1"},
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
            ],
        },
    };
}

const mainStore = new MainStore();
export default mainStore;
