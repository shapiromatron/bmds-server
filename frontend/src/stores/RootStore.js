import DataStore from "./DataStore";
import DatasetModelOptionStore from "./DatasetModelOptionStore";
import OutputStore from "./OutputStore";
import MainStore from "./MainStore";
import OptionsStore from "./OptionsStore";
import ModelsStore from "./ModelsStore";
import LogicStore from "./LogicStore";

class RootStore {
    constructor() {
        this.mainStore = new MainStore(this);
        this.dataStore = new DataStore(this);
        this.dataOptionStore = new DatasetModelOptionStore(this);
        this.optionsStore = new OptionsStore(this);
        this.modelsStore = new ModelsStore(this);
        this.outputStore = new OutputStore(this);
        this.logicStore = new LogicStore(this);
    }
}

const rootStore = new RootStore();
export default rootStore;
