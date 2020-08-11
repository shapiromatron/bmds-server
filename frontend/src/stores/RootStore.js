import DataStore from "./DataStore";
import OutputStore from "./OutputStore";
import MainStore from "./MainStore";
import OptionsStore from "./OptionsStore";
import ModelsStore from "./ModelsStore";

class RootStore {
    constructor() {
        this.mainStore = new MainStore(this);
        this.dataStore = new DataStore(this);
        this.optionsStore = new OptionsStore(this);
        this.modelsStore = new ModelsStore(this);
        this.outputStore = new OutputStore(this);
    }
}

const rootStore = new RootStore();
export default rootStore;
