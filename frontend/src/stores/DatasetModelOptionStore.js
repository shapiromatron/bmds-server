import _ from "lodash";
import {computed, observable, action} from "mobx";

import {adverseDirectionOptions, Dtype, datasetOptions} from "../constants/dataConstants";

class DatasetModelOptionStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable options = [];

    @computed get canEdit() {
        return this.rootStore.mainStore.canEdit;
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
    }
    @action.bound deleteOption(dataset_id) {
        const index = _.findIndex(this.options, d => d.dataset_id === dataset_id);
        this.options.splice(index, 1);
    }
    @action.bound createOption(dataset) {
        const option = _.cloneDeep(datasetOptions[this.getModelType]);
        option.dataset_id = dataset.metadata.id;
        this.options.push(option);
    }
    @action.bound getDataset(option) {
        return _.find(this.rootStore.dataStore.datasets, d => d.metadata.id === option.dataset_id);
    }
}

export default DatasetModelOptionStore;
