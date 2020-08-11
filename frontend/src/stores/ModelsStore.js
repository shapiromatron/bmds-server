import _ from "lodash";
import {observable, action, computed} from "mobx";
import {modelsList} from "../constants/modelConstants";

class ModelsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.setDefaultsByDatasetType();
    }

    @observable models_list = [];
    @observable models = [];
    @observable model_headers = [];

    @observable prior_weight = 0;
    @observable prior_weight_models = [];

    @observable selected_models = [];

    @action getEditSettings() {
        return this.rootStore.mainStore.getEditSettings();
    }

    @action getmodelsHeaders() {
        let modelsHeader = {};
        if (this.rootStore.mainStore.dataset_type === "N") {
            modelsHeader = this.NestedCheckBoxHeaders;
        } else {
            modelsHeader = this.modelsCheckBoxHeaders;
        }
        return modelsHeader;
    }

    @action setDefaultsByDatasetType() {
        let dataset_type = this.rootStore.mainStore.dataset_type;
        this.models = _.cloneDeep(modelsList[dataset_type]);
    }

    @computed get getModels() {
        return this.models;
    }

    @action.bound toggleModelsCheckBox(selectedModel, checked, value) {
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
    }

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
}

export default ModelsStore;
