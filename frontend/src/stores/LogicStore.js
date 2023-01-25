import {action, computed, observable} from "mobx";

class LogicStore {
    @observable logic = null;

    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @computed get canEdit() {
        return this.rootStore.mainStore.canEdit;
    }

    @computed get modelType() {
        return this.rootStore.mainStore.model_type;
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
        this.rootStore.mainStore.setInputsChangedFlag();
    }
    @action.bound updateLogic(key, value) {
        this.logic[key] = value;
        this.rootStore.mainStore.setInputsChangedFlag();
    }
    @action.bound updateRule(ruleIndex, key, value) {
        this.logic.rules[ruleIndex][key] = value;
        this.rootStore.mainStore.setInputsChangedFlag();
    }
}
export default LogicStore;
