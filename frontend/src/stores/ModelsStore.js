import _ from "lodash";
import {observable, action, computed} from "mobx";

import {modelsList, models} from "../constants/modelConstants";

import * as mc from "../constants/mainConstants";

class ModelsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable model_headers = {};
    @observable models = {};
    @observable prior_weight = 100;

    @computed get canEdit() {
        return this.rootStore.mainStore.canEdit;
    }

    @action.bound setDefaultsByDatasetType(force) {
        if (this.numModelsSelected === 0 || force) {
            this.models = models[this.getModelType];
        }
    }

    @computed get numModelsSelected() {
        return _.chain(this.models)
            .values()
            .reduce((sum, d) => d.length, 0)
            .value();
    }

    @computed get getModelType() {
        return this.rootStore.mainStore.model_type;
    }

    @action.bound setModels(models) {
        this.models = models;
        this.setDefaultsByDatasetType();
    }

    @action.bound enableAll(name, checked) {
        modelsList[this.getModelType].forEach(item => {
            this.setModelSelection(name, item, checked);
        });
    }

    @action.bound setModelSelection(name, model, checked) {
        if (checked) {
            if (!(name in this.models)) {
                this.models[name] = [];
            }
            if (name === mc.BAYESIAN_MODEL_AVERAGE) {
                let bma = {
                    model,
                    prior_weight: "",
                };
                let obj = this.models[name].find(obj => obj.model === model);
                if (obj === undefined) {
                    this.models[name].push(bma);
                }
                this.setPriorWeight();
            } else {
                if (!this.models[name].includes(model)) {
                    this.models[name].push(model);
                }
            }
        } else {
            let index = -1;
            if (name === mc.BAYESIAN_MODEL_AVERAGE) {
                index = this.models[name].findIndex(obj => obj.model === model);
                if (index > -1) {
                    this.models[name].splice(index, 1);
                    this.setPriorWeight();
                }
            } else {
                index = this.models[name].indexOf(model);
                if (index > -1) {
                    this.models[name].splice(index, 1);
                }
            }

            if (!this.models[name].length) {
                delete this.models[name];
            }
        }
    }

    @action.bound setPriorWeight() {
        this.models[mc.BAYESIAN_MODEL_AVERAGE].forEach(obj => {
            obj.prior_weight = this.prior_weight / this.models[mc.BAYESIAN_MODEL_AVERAGE].length;
        });
    }
}

export default ModelsStore;
