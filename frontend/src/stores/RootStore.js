import dataStore from "./DataStore";
import outputStore from "./OutputStore";
import mainStore from "./MainStore";

class RootStore {
    constructor() {
        this.dataStore = dataStore;
        this.mainStore = mainStore;
        this.outputStore = outputStore;
    }
}

const rootStore = new RootStore();
export default rootStore;
