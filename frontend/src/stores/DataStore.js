import {observable, action, computed} from "mobx";
import {toJS} from "mobx";

class DataStore {
    @observable config = {};
    @observable datasets = [];
    @observable activeDataset = [];
    @observable models = [];
    @observable modelType = [];
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
    @action addModelType = modelType => {
        this.modelType.push(modelType);
    };
    @action showDataForm = formType => {
        this.showForm = true;
        this.dataFormType.push(formType);
    };
    @action deleteDataForm() {
        this.dataFormType = [];
        this.showForm = false;
    }

    @action getFormType() {
        return this.dataFormType[0].toString();
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
        var index = this.datasets.findIndex(item => item.id == id);
        if (index > -1) {
            this.datasets.splice(index, 1);
        }
    };
    @action addActiveDataset = dataset => {
        this.activeDataset.push(dataset);
    };
    @action deleteActiveDataset = id => {
        var index = this.activeDataset.findIndex(item => item.id == id);
        if (index > -1) {
            this.activeDataset.splice(index, 1);
        }
    };

    @action filterData = datasets => {
        var output = {};
        datasets.forEach(data => {
            data.dataset.forEach(newset => {
                for (var prop in newset) {
                    if (prop in newset) {
                        if (!(prop in output)) {
                            output[prop] = [];
                        }
                    }
                    output[prop].push(newset[prop]);
                }
            });
            output.id = data.id;
            data.dataset = output;
        });
        return output;
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

    @action filterModel = models => {
        let result = {};
        models.map(item => {
            var [k, v] = item.split("-");
            if (k in result) {
                result[k] = result[k].concat(v);
            } else {
                result[k] = [v];
            }
        });
        return result;
    };

    @action saveOptions = (name, value, id) => {
        let idx = id.split("-");
        let id1 = idx[1];
        var index = this.options.findIndex(val => val.id == id1);
        if (index === -1) {
            this.options.push({id: id1, [name]: value});
        } else {
            var object = this.options.find(val => val.id == id1);
            object[name] = value;
        }
    };

    @action deleteOptions = val => {
        var index = this.options.findIndex(item => item.id == val);

        if (index > -1) {
            this.options.splice(index, 1);
        }
    };

    @action filterOptions = options => {
        options.forEach(item => {
            delete item["id"];
            item["bmr_value"] = parseFloat(item["bmr_value"]);
            item["tail_probability"] = parseFloat(item["tail_probability"]);
            item["confidence_level"] = parseFloat(item["confidence_level"]);
        });
        return options;
    };

    @action runAnalysis = modeltype => {
        let model = this.filterModel(toJS(this.models));
        let data = [this.filterData(toJS(this.activeDataset))];
        let option = this.filterOptions(toJS(this.options));
        let url = toJS(this.config)["editSettings"].patchInputUrl;
        let key = toJS(this.config)["editSettings"].editKey;

        let payload = {
            editKey: key,
            data: {
                bmds_version: "BMDS312",
                dataset_type: modeltype,
                models: model,
                datasets: data,
                options: option,
            },
        };

        this.runAnalysisAPI(payload, url);
    };

    @action
    async runAnalysisAPI(data, url) {
        try {
            const response = await fetch(url, {
                method: "PATCH",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            console.log(response);
        } catch (err) {
            console.log(err);
        }
    }

    @computed get modelTypeLength() {
        return this.modelType.length;
    }

    @computed get getDataLength() {
        return this.datasets.length;
    }
}

const store = new DataStore();
export default store;
