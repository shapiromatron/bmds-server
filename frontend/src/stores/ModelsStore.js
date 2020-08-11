import {observable, action, computed} from "mobx";
import rootStore from "./RootStore";

class ModelsStore {
    @observable dataset_type = "C";
    @observable models_list = [];
    @observable models = [];
    @observable model_headers = [];

    @observable prior_weight = 0;
    @observable prior_weight_models = [];

    @observable selected_models = [];

    @action getEditSettings() {
        return rootStore.mainStore.getEditSettings();
    }

    @action getmodelsHeaders() {
        let modelsHeader = {};
        if (this.dataset_type === "N") {
            modelsHeader = this.NestedCheckBoxHeaders;
        } else {
            modelsHeader = this.modelsCheckBoxHeaders;
        }
        return modelsHeader;
    }

    @action getModelsList(dataset_type) {
        this.models = this.modelsList[dataset_type];
    }

    @computed get getModels() {
        return this.models;
    }

    @action toggleModelsCheckBox = (selectedModel, checked, value) => {
        let models = this.models;
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

    @observable modelsList = {
        C: [
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
                    {
                        name: "bayesian-Linear",
                        type: "checkbox",
                        isChecked: false,
                        isDisabled: false,
                    },
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
        ],
        D: [
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
                    {
                        name: "bayesian-Logistic",
                        type: "checkbox",
                        isChecked: false,
                        isDisabled: false,
                    },
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
                    {
                        name: "bayesian-LogProbit",
                        type: "checkbox",
                        isChecked: false,
                        isDisabled: false,
                    },
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
                    {
                        name: "bayesian-Probit",
                        type: "checkbox",
                        isChecked: false,
                        isDisabled: false,
                    },
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
                    {
                        name: "bayesian-Weibull",
                        type: "checkbox",
                        isChecked: false,
                        isDisabled: false,
                    },
                    {
                        name: "bayesian_model_average-Weibull",
                        type: "checkbox",
                        isChecked: false,
                        isDisabled: false,
                        prior_weight: "0",
                    },
                ],
            },
        ],
        N: [
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
        ],
    };
}

const modelsStore = new ModelsStore();
export default modelsStore;
