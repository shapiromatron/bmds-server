import {observable, action, computed} from "mobx";

class LogicStore {
    @observable logic = null;

    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @computed get canEdit() {
        return this.rootStore.mainStore.canEdit;
    }

    @action.bound setLogic(data) {
        this.logic = data;
    }
    @action.bound async resetLogic() {
        const url = "/api/v1/analysis/default/";
        await fetch(url, {
            method: "GET",
            mode: "cors",
        })
            .then(response => response.json())
            .then(json => {
                this.logic = json.recommender;
            });
    }
    @action.bound updateLogic(key, value) {
        this.logic[key] = value;
    }
    @action.bound updateRule(ruleIndex, key, value) {
        this.logic.rules[ruleIndex][key] = value;
    }
}
export default LogicStore;
