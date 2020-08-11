import dataStore from "./DataStore";
import outputStore from "./OutputStore";
import mainStore from "./MainStore";
import optionsStore from "./OptionsStore";
import modelsStore from "./ModelsStore";

class RootStore {
    constructor() {
        this.dataStore = dataStore;
        this.mainStore = mainStore;
        this.outputStore = outputStore;
        this.optionsStore = optionsStore;
        this.modelsStore = modelsStore;
    }
}

const rootStore = new RootStore();
export default rootStore;
