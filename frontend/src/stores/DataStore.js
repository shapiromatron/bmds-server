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

    @observable prior_weight = 0;
    @observable prior_weight_models = [];

    @observable CSForm = [];
    @observable options = [];
    @observable models = [];

    @observable modelsCheckBoxHeaders = [
        {
            model: "",
            values: [
                {name: "MLE", colspan: "2"},
                {name: "ALternatives", colspan: "2"},
            ],
        },
        {
            model: "",
            values: [
                {name: "Frequntist Restricted", colspan: "1"},
                {name: "Frequentist Unrestricted", colspan: "1"},
                {name: "Bayesian", colspan: "1"},
                {name: "Bayesian Model Average", colspan: "1"},
            ],
        },

        {
            model: "Model Name",
            values: [
                {
                    name: "Enable",
                    model_name: "frequentist_restricted",
                    colspan: "1",
                    type: "checkBox",
                    input: true,
                },
                {
                    name: "Enable",
                    model_name: "frequentist_unrestricted",
                    colspan: "1",
                    type: "checkBox",
                    input: true,
                },
                {
                    name: "Enable",
                    model_name: "bayesian",
                    colspan: "1",
                    type: "checkBox",
                    input: true,
                },
                {
                    name: "Enable",
                    model_name: "bayesian_model_average",
                    colspan: "1",
                    type: "checkBox",
                    input: true,
                    prior_weight: "Prior Weight",
                },
            ],
        },
    ];

    @observable CmodelType = [
        {
            model: "Exponential",
            values: [
                {
                    name: "frequentist_restricted-Exponential",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-Exponential",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "bayesian-Exponential",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian_model_average-Exponential",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Hill",
            values: [
                {
                    name: "frequentist_restricted-Hill",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-Hill",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {name: "bayesian-Hill", type: "checkbox", isChecked: false, isDisabled: false},
                {
                    name: "bayesian_model_average-Hill",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Linear",
            values: [
                {
                    name: "frequentist_restricted-Linear",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "frequentist_unrestricted-Linear",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {name: "bayesian-Linear", type: "checkbox", isChecked: false, isDisabled: false},
                {
                    name: "bayesian_model_average-Linear",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Polynomial",
            values: [
                {
                    name: "frequentist_restricted-Polynomial",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-Polynomial",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian-Polynomial",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian_model_average-Polynomial",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Power",
            values: [
                {
                    name: "frequentist_restricted-Power",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-Power",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {name: "bayesian-Power", type: "checkbox", isChecked: false, isDisabled: false},
                {
                    name: "bayesian_model_average-Power",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
    ];

    @observable DmodelType = [
        {
            model: "Dichotomous Hill",
            values: [
                {
                    name: "frequentist_restricted-DichotomousHill",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-DichotomousHill",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian-DichotomousHill",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian_model_average-DichotomousHill",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Gamma",
            values: [
                {
                    name: "frequentist_restricted-Gamma",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-Gamma",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {name: "bayesian-Gamma", type: "checkbox", isChecked: false, isDisabled: false},
                {
                    name: "bayesian_model_average-Gamma",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Logistic",
            values: [
                {
                    name: "frequentist_restricted-Logistic",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "frequentist_unrestricted-Logistic",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {name: "bayesian-Logistic", type: "checkbox", isChecked: false, isDisabled: false},
                {
                    name: "bayesian_model_average-Logistic",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Log Logistic",
            values: [
                {
                    name: "frequentist_restricted-LogLogistic",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-LogLogistic",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian-LogLogistic",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian_model_average-LogLogistic",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Log Probit",
            values: [
                {
                    name: "frequentist_restricted-LogProbit",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-LogProbit",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {name: "bayesian-LogProbit", type: "checkbox", isChecked: false, isDisabled: false},
                {
                    name: "bayesian_model_average-LogProbit",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Multistage",
            values: [
                {
                    name: "frequentist_restricted-Multistage",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-Multistage",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian-Multistage",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian_model_average-Multistage",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Probit",
            values: [
                {
                    name: "frequentist_restricted-Probit",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "frequentist_unrestricted-Probit",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {name: "bayesian-Probit", type: "checkbox", isChecked: false, isDisabled: false},
                {
                    name: "bayesian_model_average-Probit",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Quantal Linear",
            values: [
                {
                    name: "frequentist_restricted-QuantalLinear",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "frequentist_unrestricted-QuantalLinear",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian-QuantalLinear",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian_model_average-QuantalLinear",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
        {
            model: "Weibull",
            values: [
                {
                    name: "frequentist_restricted-Weibull",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-Weibull",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                },
                {name: "bayesian-Weibull", type: "checkbox", isChecked: false, isDisabled: false},
                {
                    name: "bayesian_model_average-Weibull",
                    type: "checkbox",
                    isChecked: false,
                    isDisabled: false,
                    prior_weight: "0",
                },
            ],
        },
    ];

    @observable CSForm = [
        {label: "Dose", name: "doses"},
        {label: "N", name: "ns"},
        {label: "Mean", name: "means"},
        {label: "St Dev", name: "stdevs"},
    ];
    @observable CIForm = [
        {label: "Dose", name: "doses"},
        {label: "Response", name: "responses"},
    ];

    @observable DichotomousForm = [
        {label: "Dose", name: "doses"},
        {label: "N", name: "ns"},
        {label: "Incidence", name: "incidences"},
    ];
    @observable NestedForm = [
        {label: "Dose", name: "doses"},
        {label: "Litter Size", name: "ls"},
        {label: "Incidence", name: "incidences"},
        {label: "Litter Specific Covariate", name: "lsc"},
    ];

    @observable getDataFormList() {
        let forms = [];
        switch (this.dataFormType) {
            case "CS":
                forms = this.CSForm;
                break;
            case "D":
                forms = this.DichotomousForm;
                break;
            case "CI":
                forms = this.CIForm;
                break;
            case "NS":
                forms = this.NestedForm;
                break;
        }
        return forms;
    }

    @observable getModelTypeList() {
        let models = [];
        if (this.modelType == "C") {
            models = this.CmodelType;
        } else if (this.modelType == "D") {
            models = this.DmodelType;
        }
        return models;
    }

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
                bmr_type: "",
                bmr_value: "",
                confidence_level: "",
                background: "",
            });
        }
    }

    @action createForm(formType) {
        switch (formType) {
            case "CS":
                this.datasets.push({
                    doses: "",
                    ns: "",
                    means: "",
                    stdevs: "",
                });
                break;
            case "D":
                this.datasets.push({
                    doses: "",
                    ns: "",
                    incidences: "",
                });
                break;
            case "CI":
                this.datasets.push({
                    doses: "",
                    response: "",
                });
                break;
            case "NS":
                this.datasets.push({
                    doses: "",
                    litter_size: "",
                    incidences: "",
                    litter_Specific_covariate: "",
                });
                break;
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

    @action toggleModelsCheckBox = (model, checked, value) => {
        let models = this.getModelTypeList();

        if (model.includes("bayesian_model_average") && checked) {
            this.prior_weight_models.push(model);
        } else if (model.includes("bayesian_model_average") && !checked) {
            let index = this.prior_weight_models.indexOf(model);
            this.prior_weight_models.splice(index, 1);
        }

        if (this.prior_weight_models.length) {
            this.prior_weight = 100;
            this.prior_weight = this.prior_weight / this.prior_weight_models.length;
        }
        models.map(item => {
            item.values.map(val => {
                if (val.name === model) {
                    val.isChecked = !val.isChecked;
                } else if (
                    model.split("-")[1] == "All" &&
                    model.split("-")[0] == val.name.split("-")[0] &&
                    !val.isDisabled
                ) {
                    val.isChecked = !val.isChecked;
                }

                if (this.prior_weight_models.includes(val.name)) {
                    val.prior_weight = this.prior_weight;
                } else if (
                    val.name.includes("bayesian_model_average") &&
                    !this.prior_weight_models.includes(val.name)
                ) {
                    val.prior_weight = 0;
                }
            });
        });
    };

    //returns the dataset which are enabled
    @action getEnabledDataset() {
        let obj = toJS(this.savedDataset).filter(item => item.enabled == true);
        return obj;
    }

    //returns enabled model types
    @action getModels() {
        let result = {};
        let models = toJS(this.getModelTypeList());

        models.forEach(item => {
            item.values.forEach(val => {
                if (val.isChecked) {
                    var [k, v] = val.name.split("-");
                    if (v === "DichotomousHill") {
                        v = "Dichotomous-Hill";
                    }
                    if (k in result) {
                        if (k === "bayesian_model_average") {
                            result[k] = result[k].concat({
                                model: v,
                                prior_weight: parseFloat(val.prior_weight) / 100,
                            });
                        } else {
                            result[k] = result[k].concat(v);
                        }
                    } else {
                        if (k === "bayesian_model_average") {
                            result[k] = [
                                {model: v, prior_weight: parseFloat(val.prior_weight) / 100},
                            ];
                        } else {
                            result[k] = [v];
                        }
                    }
                }
            });
        });

        return result;
    }

    @action runAnalysis = (model_type, analysis_name, analysis_description) => {
        let model = this.getModels();
        let data = this.getEnabledDataset();
        let option = this.options;
        let url = this.config.editSettings.patchInputUrl;
        let key = this.config.editSettings.editKey;

        let payload = {
            editKey: key,
            partial: true,
            data: {
                bmds_version: "BMDS312",
                analysis_name,
                analysis_description,
                dataset_type: model_type,
                models: model,
                datasets: data,
                options: option,
            },
        };

        this.runAnalysisAPI(payload, url);
    };

    @action
    async runAnalysisAPI(payload, url) {
        return fetch(url, {
            method: "PATCH",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then(response => {
                console.log(response);
                response.json().then(data => console.log(data));
            })
            .catch(error => {
                console.log("error", error);
            });
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
