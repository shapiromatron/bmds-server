import _ from "lodash";
import {makeAutoObservable} from "mobx";

import {datasetOptions, getDefaultDegree} from "@/constants/dataConstants";

class DatasetModelOptionStore {
    constructor(rootStore) {
        makeAutoObservable(this, {rootStore: false}, {autoBind: true});
        this.rootStore = rootStore;
    }

    options = [];

    get canEdit() {
        return this.rootStore.mainStore.canEdit;
    }

    get getModelType() {
        return this.rootStore.mainStore.model_type;
    }

    setDatasetOptions(options) {
        this.options = options;
    }
    updateOption(dataset_id, key, value) {
        const index = _.findIndex(this.options, d => d.dataset_id === dataset_id);
        this.options[index][key] = value;
        this.rootStore.mainStore.setInputsChangedFlag();
    }
    deleteOption(dataset_id) {
        const index = _.findIndex(this.options, d => d.dataset_id === dataset_id);
        this.options.splice(index, 1);
    }
    createOption(dataset) {
        const option = _.cloneDeep(datasetOptions[this.getModelType]);
        option.dataset_id = dataset.metadata.id;
        this.options.push(option);
    }
    updateDefaultDegree(dataset) {
        const index = _.findIndex(this.options, d => d.dataset_id === dataset.metadata.id);
        if (this.options[index].degree !== undefined) {
            this.options[index].degree = getDefaultDegree(dataset);
        }
    }
    getDataset(option) {
        return _.find(this.rootStore.dataStore.datasets, d => d.metadata.id === option.dataset_id);
    }
}

export default DatasetModelOptionStore;
