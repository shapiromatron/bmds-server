import {observable, action, computed} from "mobx";
import _ from "lodash";
import * as constant from "../constants/optionsConstants";

class OptionsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.setDefaultsByDatasetType();
    }

    @observable optionsList = [];
    @observable headers = [];

    @computed get getEditSettings() {
        return this.rootStore.mainStore.getEditSettings;
    }

    @action.bound setDefaultsByDatasetType() {
        const option = _.cloneDeep(constant.options[this.getDatasetType]);
        this.optionsList = [option];
        this.headers = constant.headers[this.getDatasetType];
    }

    @action.bound addOptions() {
        const option = _.cloneDeep(constant.options[this.getDatasetType]);
        this.optionsList.push(option);
    }

    @action.bound saveOptions(name, value, id) {
        this.optionsList[id][name] = value;
    }

    @action.bound deleteOptions(val) {
        this.optionsList.splice(val, 1);
    }
    @action setOptions(options) {
        this.optionsList = options;
        this.headers = constant.headers[this.getDatasetType];
    }

    @computed get getDatasetType() {
        return this.rootStore.mainStore.dataset_type;
    }

    @computed get checkOptionsLength() {
        if (this.optionsList.length > 2) {
            return true;
        }
        return false;
    }
}

export default OptionsStore;
