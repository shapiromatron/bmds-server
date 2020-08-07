import {observable, action} from "mobx";
import _ from "lodash";
import rootStore from "./RootStore";
import * as constant from "../constants/optionsConstants";

class OptionsStore {
    @observable dataset_type = "C";
    @observable optionsList = [];

    @action getEditSettings() {
        return rootStore.mainStore.getEditSettings();
    }
    @action getOptionsLabels() {
        return constant.optionsLabel[this.dataset_type];
    }

    @action addOptions() {
        let option = _.cloneDeep(constant.options[this.dataset_type]);
        this.optionsList.push(option);
    }
    @action saveOptions = (name, value, id) => {
        this.optionsList[id][name] = value;
    };
    @action deleteOptions = val => {
        this.optionsList.splice(val, 1);
    };
}

const optionsStore = new OptionsStore();
export default optionsStore;
