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
    @action.bound changeDecisionLogicValues(key, value) {
        this.logic[key] = value;
    }
    @action.bound changeLogicValues(rule, key, value) {
        this.logic.rules[rule][key] = value;
    }
}
export default LogicStore;
