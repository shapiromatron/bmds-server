import {observable, action, computed} from "mobx";
import {logic} from "../constants/logicConstants";
import _ from "lodash";

class LogicStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.setDefaultState();
    }
    @observable logic = {};

    @action.bound setDefaultState() {
        this.logic = _.cloneDeep(logic);
    }
    @computed get getLogic() {
        return this.logic;
    }
    @action.bound changeDecisionLogicValues(key, value) {
        this.logic[key] = value;
    }
    @action.bound changeLogicValues(rule, key, value) {
        this.logic.rules[rule][key] = value;
    }
    @action setLogic(inputs) {
        this.logic = inputs.logic;
    }
}
export default LogicStore;
