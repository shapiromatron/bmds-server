import _ from "lodash";
import {makeAutoObservable} from "mobx";

import {MODEL_CONTINUOUS} from "@/constants/mainConstants";
import * as constant from "@/constants/optionsConstants";

class OptionsStore {
    constructor(rootStore) {
        makeAutoObservable(this, {rootStore: false}, {autoBind: true});
        this.rootStore = rootStore;
    }

    optionsList = [];
    get canEdit() {
        return this.rootStore.mainStore.canEdit;
    }

    setDefaultsByDatasetType(force) {
        if (this.optionsList.length === 0 || force) {
            const option = _.cloneDeep(constant.options[this.getModelType]);
            this.optionsList = [option];
        }
    }

    addOptions() {
        const option = _.cloneDeep(constant.options[this.getModelType]);
        this.optionsList.push(option);
        this.rootStore.mainStore.setInputsChangedFlag();
    }

    saveOptions(name, value, id) {
        this.optionsList[id][name] = value;
        this.rootStore.mainStore.setInputsChangedFlag();
        if (name === constant.BMR_TYPE && this.getModelType === MODEL_CONTINUOUS) {
            //  change default BMR value if the BMR type was changed for continuous datasets
            this.optionsList[id][constant.BMR_VALUE] = constant.bmrForBmrTypeContinuous[value];
        }
    }

    deleteOptions(val) {
        this.optionsList.splice(val, 1);
        this.rootStore.mainStore.setInputsChangedFlag();
    }
    setOptions(options) {
        this.optionsList = options;
        this.setDefaultsByDatasetType();
    }

    get getModelType() {
        return this.rootStore.mainStore.model_type;
    }

    get canAddNewOption() {
        return this.optionsList.length < 6;
    }
}

export default OptionsStore;
