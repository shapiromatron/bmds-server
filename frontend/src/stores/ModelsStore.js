import {observable, action, computed} from "mobx";
import {modelsList, modelHeaders, nestedHeaders, model} from "../constants/modelConstants";
import _ from "lodash";

class ModelsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.setDefaultsByDatasetType();
    }

    @observable model_headers = {};
    @observable models = [];
    @observable prior_weight = 0;
    @observable prior_weight_models = [];

    @computed get getEditSettings() {
        return this.rootStore.mainStore.getEditSettings;
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

    @action.bound toggleModelsCheckBox(selectedModel, checked) {
        if (selectedModel.split("-")[1] == "All") {
            this.model_headers.third.values.map(value => {
                if (value.model_name == selectedModel.split("-")[0]) {
                    value.isChecked = checked;
                    this.enableAllModels(selectedModel, checked);
                }
            });
        } else {
            this.models.map(item => {
                item.values.map(value => {
                    if (value.name === selectedModel && !value.isDisabled) {
                        value.isChecked = checked;
                        this.checkAllEnabled(selectedModel);
                        if (selectedModel.split("-")[0] === model.Bayesian_Model_Average) {
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

        this.models.map(item => {
            item.values.map(val => {
                if (val.name.includes(model.Bayesian_Model_Average)) {
                    if (this.prior_weight_models.includes(val.name)) {
                        val.prior_weight = this.prior_weight;
                    } else {
                        val.prior_weight = 0;
                    }
                }
            });
        });
    }

    @action enableAllModels(selectedModel, isChecked) {
        this.models.map(item => {
            item.values.map(value => {
                if (value.name.split("-")[0] === selectedModel.split("-")[0] && !value.isDisabled) {
                    value.isChecked = isChecked;
                    if (selectedModel.split("-")[0] == model.Bayesian_Model_Average) {
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
    @action checkAllEnabled(modelName) {
        let totalModels = [];
        let enabledModels = [];
        this.models.map(model => {
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

    //returns enabled model types
    @computed get getEnabledModels() {
        let result = {};
        this.models.map(item => {
            item.values.map(val => {
                if (val.isChecked) {
                    var [k, v] = val.name.split("-");
                    if (v === model.DichotomousHill) {
                        v = model.Dichotomous_Hill;
                    }
                    if (k in result) {
                        if (k === model.Bayesian_Model_Average) {
                            result[k] = result[k].concat({
                                model: v,
                                prior_weight: parseFloat(val.prior_weight) / 100,
                            });
                        } else {
                            result[k] = result[k].concat(v);
                        }
                    } else {
                        if (k === model.Bayesian_Model_Average) {
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

    @action setModels(inputs) {
        this.setDefaultsByDatasetType();
        let modelArr = [];
        Object.keys(inputs.models).map((item, i) => {
            inputs.models[item].map(val => {
                if (item === model.Bayesian_Model_Average) {
                    val = val.model;
                }
                if (val == model.Dichotomous_Hill) {
                    let [k, v] = val.split("-");
                    val = k + v;
                }
                val = item + "-" + val;
                modelArr.push(val);
            });
        });
        modelArr.forEach((model, i) => {
            let checked = true;
            this.toggleModelsCheckBox(model, checked);
        });
    }
}

export default ModelsStore;
