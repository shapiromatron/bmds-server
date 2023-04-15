import {makeAutoObservable} from "mobx";

class LogicStore {
    logic = null;

    constructor(rootStore) {
        makeAutoObservable(this, {rootStore: false}, {autoBind: true});
        this.rootStore = rootStore;
    }

    get canEdit() {
        return this.rootStore.mainStore.canEdit;
    }

    get modelType() {
        return this.rootStore.mainStore.model_type;
    }

    setLogic(data) {
        this.logic = data;
    }
    async resetLogic() {
        const url = "/api/v1/analysis/default/";
        await fetch(url, {
            method: "GET",
            mode: "cors",
        })
            .then(response => response.json())
            .then(json => json.recommender)
            .then(this.setLogic);
        this.rootStore.mainStore.setInputsChangedFlag();
    }
    updateLogic(key, value) {
        this.logic[key] = value;
        this.rootStore.mainStore.setInputsChangedFlag();
    }
    updateRule(ruleIndex, key, value) {
        this.logic.rules[ruleIndex][key] = value;
        this.rootStore.mainStore.setInputsChangedFlag();
    }
}
export default LogicStore;
