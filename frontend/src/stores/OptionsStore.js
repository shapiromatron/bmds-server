import {observable, action} from "mobx";
import _ from "lodash";
import {headers, options} from "../constants/optionsConstants";

class OptionsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.setDefaultsByDatasetType();
    }

    @observable optionsList = [];
    @observable headers = [];

    @action.bound getEditSettings() {
        return this.rootStore.mainStore.getEditSettings();
    }

    @action.bound setDefaultsByDatasetType() {
        const dataset_type = this.rootStore.mainStore.dataset_type,
            option = _.cloneDeep(options[dataset_type]);

        this.optionsList = [option];
        this.headers = headers[this.rootStore.mainStore.dataset_type];
    }

    @action.bound addOptions() {
        const dataset_type = this.rootStore.mainStore.dataset_type,
            option = _.cloneDeep(options[dataset_type]);

        this.optionsList.push(option);
    }

    @action.bound saveOptions(name, value, id) {
        this.optionsList[id][name] = value;
    }

    @action.bound deleteOptions(val) {
        this.optionsList.splice(val, 1);
    }
}

export default OptionsStore;
