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

    @action.bound setDirtyData() {
        this.rootStore.mainStore.setDirtyData();
    }

    @computed get getModelType() {
        return this.rootStore.mainStore.model_type;
    }

    @action.bound setDatasetOptions(options) {
        this.options = options;
    }
    @action.bound updateOption(dataset_id, key, value) {
        const index = _.findIndex(this.options, d => d.dataset_id === dataset_id);
        this.options[index][key] = value;
        this.setDirtyData();
    }
    @action.bound deleteOption(dataset_id) {
        const index = _.findIndex(this.options, d => d.dataset_id === dataset_id);
        this.options.splice(index, 1);
        this.setDirtyData();
    }
    @action.bound createOption(dataset) {
        const opts = {dataset_id: dataset.metadata.id, enabled: true, degree: 0};
        if (dataset.dtype === Dtype.CONTINUOUS || dataset.dtype === Dtype.CONTINUOUS_INDIVIDUAL) {
            opts.adverse_direction = adverseDirectionOptions[0].value;
        }
        this.options.push(opts);
        this.setDirtyData();
    }

    @action.bound getDataset(option) {
        return _.find(this.rootStore.dataStore.datasets, d => d.metadata.id === option.dataset_id);
    }
}

export default DatasetModelOptionStore;
