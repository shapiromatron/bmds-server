import dataStore from "./DataStore";
import outputStore from "./OutputStore";
import mainStore from "./MainStore";
import optionsStore from "./OptionsStore";

class RootStore {
    constructor() {
        this.dataStore = dataStore;
        this.mainStore = mainStore;
        this.outputStore = outputStore;
        this.optionsStore = optionsStore;
    }
}

const rootStore = new RootStore();
export default rootStore;
