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
    @observable total_weight = 100;
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
        this.models.map(item => {
            item.values.map(value => {
                if (value.name === selectedModel && !value.isDisabled) {
                    value.isChecked = checked;
                    this.checkAllEnabled(selectedModel);
                    if (selectedModel.split("-")[0] === model.Bayesian_Model_Average) {
                        this.calculatePriorWeight();
                    }
                }
            });
        });
    }

    @action.bound savePriorWeght(key, val) {
        this.models.map(model => {
            model.values.map(value => {
                if (value.name == key) {
                    value.prior_weight = parseFloat(val);
                    if (this.checkTotalWeight > 100) {
                        value.prior_weight = 0;
                    } else {
                        this.total_weight = this.checkTotalWeight;
                    }
                }
            });
        });
    }

    @computed get checkTotalWeight() {
        let total_weight = [];
        this.models.map(model => {
            model.values.map(value => {
                if (value.name.split("-")[0] === model.Bayesian_Model_Average) {
                    total_weight.push(parseFloat(value.prior_weight));
                }
            });
        });
        let sum = total_weight.reduce(function(a, b) {
            return a + b;
        });
        return sum;
    }
    @action.bound calculatePriorWeight() {
        let checkedModels = [];
        this.models.map(model => {
            model.values.map(item => {
                if (item.isChecked) {
                    checkedModels.push(item);
                }
            });
        });
        let prior_weight = 100 / checkedModels.length;
        this.models.map(model => {
            model.values.map(item => {
                if (item.isChecked) {
                    item.prior_weight = prior_weight;
                } else {
                    item.prior_weight = 0;
                }
            });
        });
    }

    @action.bound enableAllModels(selectedModel, checked) {
        this.model_headers.third.values.map(value => {
            if (value.model_name == selectedModel.split("-")[0]) {
                value.isChecked = checked;
            }
        });
        this.models.map(item => {
            item.values.map(value => {
                if (value.name.split("-")[0] === selectedModel.split("-")[0] && !value.isDisabled) {
                    value.isChecked = checked;
                }
            });
        });
        this.calculatePriorWeight();
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
