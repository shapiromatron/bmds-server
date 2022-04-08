import {observable, action, computed} from "mobx";
import _ from "lodash";
import * as constant from "../constants/optionsConstants";
import {MODEL_CONTINUOUS} from "../constants/mainConstants";

class OptionsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable optionsList = [];
    @computed get canEdit() {
        return this.rootStore.mainStore.canEdit;
    }

    @action.bound setDefaultsByDatasetType(force) {
        if (this.optionsList.length === 0 || force) {
            const option = _.cloneDeep(constant.options[this.getModelType]);
            this.optionsList = [option];
        }
    }

    @action.bound addOptions() {
        const option = _.cloneDeep(constant.options[this.getModelType]);
        this.optionsList.push(option);
        this.rootStore.mainStore.analysisSavedAndValidated = false;
    }

    @action.bound saveOptions(name, value, id) {
        this.optionsList[id][name] = value;
        this.rootStore.mainStore.analysisSavedAndValidated = false;
        if (name === constant.BMR_TYPE && this.getModelType === MODEL_CONTINUOUS) {
            //  change default BMR value if the BMR type was changed for continuous datasets
            this.optionsList[id][constant.BMR_VALUE] = constant.bmrForBmrTypeContinuous[value];
        }
    }

    @action.bound deleteOptions(val) {
        this.optionsList.splice(val, 1);
        this.rootStore.mainStore.analysisSavedAndValidated = false;
    }
    @action.bound setOptions(options) {
        this.optionsList = options;
        this.setDefaultsByDatasetType();
    }

    @computed get getModelType() {
        return this.rootStore.mainStore.model_type;
    }

    @computed get canAddNewOption() {
        return this.optionsList.length < 3;
    }
}

export default OptionsStore;
