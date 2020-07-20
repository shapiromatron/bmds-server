import dataStore from "./DataStore";
import outputStore from "./OutputStore";
import mainStore from "./MainStore";
import navStore from "./NavStore"

class RootStore {
    constructor() {
        this.dataStore = dataStore;
        this.mainStore = mainStore;
        this.outputStore = outputStore;
        this.navStore = navStore;
    }
}

const rootStore = new RootStore();
export default rootStore;
