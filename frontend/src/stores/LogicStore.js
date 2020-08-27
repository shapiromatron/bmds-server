import {observable, action, computed} from "mobx";
import {
    headers,
    logic,
    disabled_properties,
    decision_logic,
    long_name,
} from "../constants/logicConstants";

class LogicStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable modelRecommendationList = [];
    @observable logic = {};

    @action setDefaultState() {
        this.logic = logic;
    }
    @computed get getModelRecommendationHeaders() {
        return headers;
    }
    @computed get getDecisionLogic() {
        return decision_logic;
    }

    @computed get getLogic() {
        return this.logic;
    }
    @computed get getLogicRules() {
        return logic.rules;
    }
    @computed get getDisableList() {
        return disabled_properties;
    }
    @computed get getLongName() {
        return long_name;
    }
    @action toggleDecisionLogic(e) {
        this.logic[e.target.name] = !this.logic[e.target.name];
    }

    @action saveCloseBMDL(e) {
        this.logic.sufficiently_close_bmdl = parseFloat(e.target.value);
    }

    @action.bound changeThreshold(rule, threshold) {
        this.logic.rules[rule].threshold = threshold;
    }

    @action.bound changeBinType(rule, binType) {
        this.logic.rules[rule].failure_bin = binType;
    }

    @action.bound toggleTest(rule, key, value) {
        this.logic.rules[rule][key] = value;
    }
}
export default LogicStore;
