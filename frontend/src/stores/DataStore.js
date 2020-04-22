import {observable, action, computed} from "mobx";

class DataStore {
    @observable config = {};
    @observable datasets = [];
    @observable activeDataset = [];
    @observable models = [];
    @observable options = [];
    @observable datasetNames = [];
    @observable modal = false;
    @observable showForm = false;
    @observable dataFormType = [];

    @action showModal() {
        this.modal = true;
    }
    @action closeModal() {
        this.modal = false;
    }
    @action showDataForm = formType => {
        this.showForm = true;
        this.dataFormType.push(formType);
    };
    @action deleteDataForm() {
        this.dataFormType = [];
        this.showForm = false;
    }

    @action getFormType() {
        return this.dataFormType[0];
    }
    @action closeDataForm() {
        this.dataform = false;
    }
    @action setConfig = config => {
        this.config = config;
    };
    @action addDataSets = dataset => {
        this.datasets.push(dataset);
    };
    @action deleteDataset = id => {
        for (let i = 0; i < this.datasets.length; i++) {
            if (this.datasets[i].id === id) {
                let index = this.datasets.indexOf(this.datasets[i]);
                if (index > -1) {
                    this.datasets.splice(index, 1);
                }
            }
        }
    };
    @action addActiveDataset = dataset => {
        this.activeDataset.push(dataset);
    };
    @action deleteActiveDataset = id => {
        for (let i = 0; i < this.activeDataset.length; i++) {
            if (this.activeDataset[i].id === id) {
                let index = this.activeDataset.indexOf(this.activeDataset[i]);
                if (index > -1) {
                    this.activeDataset.splice(index, 1);
                }
            }
        }
    };

    @action addDataSetNames = datasetname => {
        this.datasetNames.push(datasetname);
    };

    @action addModelTypes = modeltype => {
        this.models.push(modeltype);
    };

    @action deleteModelType = modeltype => {
        var index = this.models.indexOf(modeltype);
        if (index > -1) {
            this.models.splice(index, 1);
        }
    };

    @action addOptions = optionsList => {
        this.options = [];
        this.options.push(optionsList);
    };

    @computed get getDataLength() {
        return this.datasets.length;
    }
}

const store = new DataStore();
export default store;
