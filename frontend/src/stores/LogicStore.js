import {observable, action, computed} from "mobx";
import {headers, list, logic, bool, decision_logic} from "../constants/logicConstants";

class LogicStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable modelRecommendationList = [];
    @observable logic = {};

    @action setDefaultState() {
        this.modelRecommendationList = list;
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
    @action changeDecisionLogic(e) {
        this.logic[e.target.name] = bool[e.target.value];
    }

    @action changeCloseBMDL(e) {
        this.logic.sufficiently_close_bmdl = parseFloat(e.target.value);
    }

    @action toggleTest(e) {
        let name = e.target.name.split("-")[0];
        let model = e.target.name.split("-")[1];
        let value = e.target.value;
        this.modelRecommendationList.map(model => {
            model.values.map(val => {
                if (val.name == e.target.name) {
                    val.value = e.target.value;
                }
            });
        });
        let rule_object = this.logic.rules[name];
        if (model == "threshold") {
            rule_object.threshold = parseFloat(value);
        }
        Object.keys(rule_object).map(item => {
            if (item.split("_")[1] == model) {
                rule_object[item] = bool[e.target.value];
            }
        });
    }
}
export default LogicStore;
