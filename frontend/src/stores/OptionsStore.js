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
        let parsedValue = "";
        if (name == "bmr_value" || name == "tail_probability" || name == "confidence_level") {
            parsedValue = parseFloat(value);
        } else {
            parsedValue = value;
        }
        this.optionsList[id][name] = parsedValue;
    }

    @action.bound deleteOptions(val) {
        this.optionsList.splice(val, 1);
    }
    @action setOptions(inputs) {
        this.optionsList = inputs.options;
        this.headers = constant.headers[this.getDatasetType];
    }

    @computed get getDatasetType() {
        return this.rootStore.mainStore.dataset_type;
    }
    @computed get getBmrType() {
        return constant.bmr_type;
    }
    @computed get getOtherBmrType() {
        return constant.other_bmr_type;
    }
    @computed get getLitterSpecificCovariate() {
        return constant.litter_specific_covariate;
    }
    @computed get getDistribution() {
        return constant.distribution;
    }
    @computed get getVariance() {
        return constant.variance;
    }
    @computed get getPolynomialRestriction() {
        return constant.polynomial_restriction;
    }
    @computed get getBootstrapSeed() {
        return constant.bootstrap_seed;
    }
}

export default OptionsStore;
