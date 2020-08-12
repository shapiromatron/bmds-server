import _ from "lodash";
import {observable, action, computed} from "mobx";
import {modelsList, modelHeaders, nestedHeaders} from "../constants/modelConstants";

class ModelsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.setDefaultsByDatasetType();
    }

    @observable model_headers = {};
    @observable models = [];
    @observable prior_weight = 0;
    @observable prior_weight_models = [];

    @action getEditSettings() {
        return this.rootStore.mainStore.getEditSettings();
    }

    @action setDefaultsByDatasetType() {
        let dataset_type = this.rootStore.mainStore.dataset_type;
        this.models = _.cloneDeep(modelsList[dataset_type]);
        if (dataset_type === "N") {
            this.model_headers = nestedHeaders;
        } else {
            this.model_headers = modelHeaders;
        }
    }

    @computed get getModels() {
        return this.models;
    }

    @action.bound toggleModelsCheckBox(selectedModel, checked, value) {
        let models = this.models;
        if (selectedModel.split("-")[1] == "All") {
            this.model_headers.third.values.map(value => {
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
                this.model_headers.third.values.map(value => {
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
}

export default ModelsStore;
