import _ from "lodash";
import {computed, observable, action} from "mobx";

import {adverseDirectionOptions, Dtype} from "../constants/dataConstants";

class DatasetModelOptionStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable options = [];

    @computed get canEdit() {
        return this.rootStore.mainStore.canEdit;
    }

    @action.bound setOptions(options) {
        this.options = options;
    }
    @action.bound updateOption(datasetId, key, value) {
        const index = _.findIndex(this.options, d => d.datasetId === datasetId);
        this.options[index][key] = value;
    }
    @action.bound deleteOption(datasetId) {
        const index = _.findIndex(this.options, d => d.datasetId === datasetId);
        this.options.splice(index, 1);
    }
    @action.bound createOption(datasetId, dtype) {
        const opts = {datasetId, dtype, enabled: true};
        if (dtype === Dtype.CONTINUOUS || dtype === Dtype.CONTINUOUS_INDIVIDUAL) {
            opts.adverse_direction = adverseDirectionOptions[0].value;
        }
        this.options.push(opts);
    }

    @action.bound getDataset(option) {
        return _.find(this.rootStore.dataStore.datasets, d => d.metadata.id === option.datasetId);
    }
}

export default DatasetModelOptionStore;
