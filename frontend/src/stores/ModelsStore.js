import _ from "lodash";
import {makeAutoObservable} from "mobx";

import * as mc from "@/constants/mainConstants";
import {allModelOptions, models} from "@/constants/modelConstants";

class ModelsStore {
    constructor(rootStore) {
        makeAutoObservable(this, {rootStore: false}, {autoBind: true});
        this.rootStore = rootStore;
    }

    model_headers = {};
    models = {};
    prior_weight = 1;

    get canEdit() {
        return this.rootStore.mainStore.canEdit;
    }

    setDefaultsByDatasetType(force) {
        if (this.numModelsSelected === 0 || force) {
            this.models = models[this.getModelType];
        }
    }

    get numModelsSelected() {
        return _.chain(this.models)
            .values()
            .reduce((sum, d) => d.length, 0)
            .value();
    }

    get getModelType() {
        return this.rootStore.mainStore.model_type;
    }

    get hasBayesianModels() {
        const modelType = this.getModelType;
        return modelType === mc.MODEL_DICHOTOMOUS || modelType === mc.MODEL_CONTINUOUS;
    }

    setModels(models) {
        this.models = models;
        this.setDefaultsByDatasetType();
    }

    enableAll(name, checked) {
        allModelOptions[this.getModelType][name].map(model => {
            this.setModelSelection(name, model, checked);
        });
    }

    resetModelSelection() {
        this.setDefaultsByDatasetType(true);
        this.rootStore.mainStore.setInputsChangedFlag();
    }

    setModelSelection(name, model, checked) {
        if (checked) {
            if (!(name in this.models)) {
                this.models[name] = [];
            }
            if (name === mc.BAYESIAN) {
                let bma = {
                    model,
                    prior_weight: 0,
                };
                let obj = this.models[name].find(obj => obj.model === model);
                if (obj === undefined) {
                    this.models[name].push(bma);
                }
                this.setDefaultPriorWeights();
            } else {
                if (!this.models[name].includes(model)) {
                    this.models[name].push(model);
                }
            }
        } else {
            let index = -1;
            if (name === mc.BAYESIAN) {
                index = this.models[name].findIndex(obj => obj.model === model);
                if (index > -1) {
                    this.models[name].splice(index, 1);
                    this.setDefaultPriorWeights();
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
        this.rootStore.mainStore.setInputsChangedFlag();
    }

    setDefaultPriorWeights() {
        const value = parseFloat((this.prior_weight / this.models[mc.BAYESIAN].length).toFixed(3));
        this.models[mc.BAYESIAN].forEach(obj => {
            obj.prior_weight = value;
        });
    }

    setPriorWeight(model, value) {
        let modelIndex = _.findIndex(this.models[mc.BAYESIAN], d => d.model === model);
        if (modelIndex >= 0) {
            this.models[mc.BAYESIAN][modelIndex].prior_weight = parseFloat(value);
        }
    }
}

export default ModelsStore;
