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

    @action changeThreshold(e) {
        let name = e.target.name.split("-")[0];
        this.logic.rules[name].threshold = parseFloat(e.target.value);
    }

    @action changeBinType(e) {
        let name = e.target.name.split("-")[0];
        this.logic.rules[name].failure_bin = parseInt(e.target.value);
    }

    @action toggleTest(e) {
        let name = e.target.name.split("-")[0];
        let model = e.target.name.split("-")[1];
        Object.keys(this.logic.rules[name]).map(item => {
            if (item.split("_")[1] == model) {
                this.logic.rules[name][item] = !this.logic.rules[name][item];
            }
        });
    }
}
export default LogicStore;
