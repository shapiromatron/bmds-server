import {observable, action, computed} from "mobx";
import {toJS} from "mobx";

class DataStore {
    @observable config = {};

    @observable datasets = [];
    @observable savedDataset = [];
    @observable datasetEditingIndex = null;

    @observable modal = false;
    @observable showForm = false;

    @observable modelType = "";
    @observable dataFormType = "";

    @observable CSForm = [];
    @observable options = [];
    @observable models = [];

    @observable CmodelType = [
        {
            model: "Exponential",
            values: [
                {name: "frequentist_restricted-Exponential", isChecked: false},
                {name: "frequentist_unrestricted-Exponential", isChecked: false},
                {name: "bayesian-Exponential", isChecked: false},
                {name: "bayesian_model_average-Exponential", isChecked: false},
            ],
        },
        {
            model: "Hill",
            values: [
                {name: "frequentist_restricted-Hill", isChecked: false},
                {name: "frequentist_unrestricted-Hill", isChecked: false},
                {name: "bayesian-Hill", isChecked: false},
                {name: "bayesian_model_average-Hill", isChecked: false},
            ],
        },
        {
            model: "Linear",
            values: [
                {name: "frequentist_restricted-Linear", isChecked: false},
                {name: "frequentist_unrestricted-Linear", isChecked: false},
                {name: "bayesian-Linear", isChecked: false},
                {name: "bayesian_model_average-Linear", isChecked: false},
            ],
        },
        {
            model: "Polynomial",
            values: [
                {name: "frequentist_restricted-Polynomial", isChecked: false},
                {name: "frequentist_unrestricted-Polynomial", isChecked: false},
                {name: "bayesian-Polynomial", isChecked: false},
                {name: "bayesian_model_average-Polynomial", isChecked: false},
            ],
        },
        {
            model: "Power",
            values: [
                {name: "frequentist_restricted-Power", isChecked: false},
                {name: "frequentist_unrestricted-Power", isChecked: false},
                {name: "bayesian-Power", isChecked: false},
                {name: "bayesian_model_average-Power", isChecked: false},
            ],
        },
    ];

    @observable DmodelType = [
        {
            model: "Dichotomous_Hill",
            values: [
                {name: "frequentist_restricted-Dichotomous_Hill", isChecked: false},
                {name: "frequentist_unrestricted-Dichotomous_Hill", isChecked: false},
                {name: "bayesian-Dichotomous_Hill", isChecked: false},
                {name: "bayesian_model_average-Dichotomous_Hill", isChecked: false},
            ],
        },
        {
            model: "Gamma",
            values: [
                {name: "frequentist_restricted-Gamma", isChecked: false},
                {name: "frequentist_unrestricted-Gamma", isChecked: false},
                {name: "bayesian-Gamma", isChecked: false},
                {name: "bayesian_model_average-Gamma", isChecked: false},
            ],
        },
        {
            model: "Logistic",
            values: [
                {name: "frequentist_restricted-Logistic", isChecked: false},
                {name: "frequentist_unrestricted-Logistic", isChecked: false},
                {name: "bayesian-Logistic", isChecked: false},
                {name: "bayesian_model_average-Logistic", isChecked: false},
            ],
        },
        {
            model: "Log_Logistic",
            values: [
                {name: "frequentist_restricted-Log_Logistic", isChecked: false},
                {name: "frequentist_unrestricted-Log_Logistic", isChecked: false},
                {name: "bayesian-Log_Logistic", isChecked: false},
                {name: "bayesian_model_average-Log_Logistic", isChecked: false},
            ],
        },
        {
            model: "Log_Probit",
            values: [
                {name: "frequentist_restricted-Log_Probit", isChecked: false},
                {name: "frequentist_unrestricted-Log_Probit", isChecked: false},
                {name: "bayesian-Log_Probit", isChecked: false},
                {name: "bayesian_model_average-Log_Probit", isChecked: false},
            ],
        },
        {
            model: "Multistage",
            values: [
                {name: "frequentist_restricted-Multistage", isChecked: false},
                {name: "frequentist_unrestricted-Multistage", isChecked: false},
                {name: "bayesian-Multistage", isChecked: false},
                {name: "bayesian_model_average-Multistage", isChecked: false},
            ],
        },
        {
            model: "Probit",
            values: [
                {name: "frequentist_restricted-Probit", isChecked: false},
                {name: "frequentist_unrestricted-Probit", isChecked: false},
                {name: "bayesian-Probit", isChecked: false},
                {name: "bayesian_model_average-Probit", isChecked: false},
            ],
        },
        {
            model: "Quantal_Linear",
            values: [
                {name: "frequentist_restricted-Quantal_Linear", isChecked: false},
                {name: "frequentist_unrestricted-Quantal_Linear", isChecked: false},
                {name: "bayesian-Quantal_Linear", isChecked: false},
                {name: "bayesian_model_average-Quantal_Linear", isChecked: false},
            ],
        },
        {
            model: "Weibull",
            values: [
                {name: "frequentist_restricted-Weibull", isChecked: false},
                {name: "frequentist_unrestricted-Weibull", isChecked: false},
                {name: "bayesian-Weibull", isChecked: false},
                {name: "bayesian_model_average-Weibull", isChecked: false},
            ],
        },
    ];

    @action createOptions() {
        if (this.modelType == "C") {
            this.options.push({
                bmr_type: "",
                bmr_value: "",
                tail_probability: "",
                confidence_level: "",
                distribution: "",
                variance: "",
                polynomial_restriction: "",
                background: "",
            });
        }

        if (this.modelType == "D") {
            this.options.push({
                risk_type: "",
                bmr_value: "",
                confidence_level: "",
                background: "",
            });
        }
    }

    @action createForm(formType) {
        if (formType == "CS") {
            this.datasets.push({
                doses: "",
                ns: "",
                means: "",
                stdevs: "",
            });
        }
        if (formType == "D") {
            this.datasets.push({
                doses: "",
                ns: "",
                incidences: "",
            });
        }
    }

    @action saveOptions = (name, value, id) => {
        this.options[id][name] = value;
    };

    @action deleteOptions = val => {
        this.options.splice(val, 1);
    };
    @action showDataForm = formType => {
        this.dataFormType = formType;
        this.showForm = true;
        this.datasets = [];
        this.createForm(formType);
    };

    @action deleteDataRow = val => {
        this.datasets.splice(val, 1);
    };

    @action saveRowData = (name, value, id) => {
        this.datasets[id][name] = value;
    };

    @action saveDataset(dataset_name) {
        var output = {};
        this.datasets.forEach(newset => {
            for (var prop in newset) {
                if (prop in newset) {
                    if (!(prop in output)) {
                        output[prop] = [];
                    }
                }
                output[prop].push(newset[prop]);
            }
        });

        output["id"] = this.savedDataset.length;
        output["dataset_name"] = dataset_name;
        output["enabled"] = false;
        output["model_type"] = this.dataFormType;
        this.savedDataset.push(output);
    }

    @action deleteDataset = id => {
        var index = this.savedDataset.findIndex(item => item.id == id);

        if (index > -1) {
            this.savedDataset.splice(index, 1);
        }
    };

    @action toggleDataset = idx => {
        var obj = this.savedDataset.find(item => item.id == idx);
        obj["enabled"] = !obj["enabled"];
    };

    @action deleteForm() {
        this.dataFormType = "";
        this.datasets = [];
        this.showForm = false;
    }

    @action showModal() {
        this.modal = true;
    }
    @action closeModal() {
        this.modal = false;
    }
    @action addModelType = value => {
        this.modelType = "";
        this.options = [];
        this.modelType = value;
    };

    @action closeDataForm() {
        this.dataform = false;
    }
    @action setConfig = config => {
        this.config = config;
    };

    @action toggleModelsCheckBox = model => {
        let models = [];
        if (this.modelType == "C") {
            models = this.CmodelType;
        } else if (this.modelType == "D") {
            models = this.DmodelType;
        }
        models.map(item => {
            item.values.map(val => {
                if (val.name === model) {
                    val.isChecked = !val.isChecked;
                }
            });
        });
    };

    //returns the dataset which are enabled
    @action getEnabledDataset() {
        let obj = toJS(this.savedDataset).filter(item => item.enabled == true);
        return obj;
    }

    //return modelType array
    @action getModels() {
        let result = {};
        let models = [];
        if (this.modelType == "C") {
            models = this.CmodelType;
        } else if (this.modelType == "D") {
            models = this.DmodelType;
        }
        toJS(models).forEach(item => {
            item.values.forEach(val => {
                if (val.isChecked) {
                    var [k, v] = val.name.split("-");
                    if (k in result) {
                        result[k] = result[k].concat(v);
                    } else {
                        result[k] = [v];
                    }
                }
            });
        });
        return result;
    }

    @action runAnalysis = modeltype => {
        let model = this.getModels();
        let data = this.getEnabledDataset();
        let option = this.options;
        let url = this.config.editSettings.patchInputUrl;
        let key = this.config.editSettings.editKey;

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
    async runAnalysisAPI(payload, url) {
        try {
            const response = await fetch(url, {
                method: "PATCH",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
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
        return this.savedDataset.length;
    }
}

const store = new DataStore();
export default store;
