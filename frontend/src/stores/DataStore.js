import {observable, action, computed, toJS} from "mobx";
import _ from "lodash";

class DataStore {
    @observable config = {};
    @observable modelDetailModal = false;
    @observable executionOutputs = null;
    @observable prior_weight = 0;
    @observable prior_weight_models = [];
    @observable model_type = "CS";
    @observable datasets = [];
    @observable options = [];
    @observable models = {};
    @observable analysisForm = {
        analysis_name: "",
        analysis_description: "",
        dataset_type: "C",
    };
    @observable modalMessage = "";
    @observable mainModal = false;

    @action setConfig = config => {
        this.config = config;
    };

    @action saveOptions = (name, value, id) => {
        this.options[id][name] = value;
    };

    @action deleteOptions = val => {
        this.options.splice(val, 1);
    };

    @observable selectedDatasetIndex = "";
    @observable currentDataset = {};
    @observable currentDatasetLabels = [];

    @action setCurrentDatasetIndex(dataset_id) {
        this.selectedDatasetIndex = dataset_id;
    }

    @action createForm() {
        let form = this.getDatasetForm();
        form["enabled"] = false;
        form["dataset_description"] = "";
        form["model_type"] = this.model_type;
        form["dataset_id"] = this.datasets.length;
        form["dataset_name"] = "DatasetName " + form["dataset_id"];
        this.selectedDatasetIndex = form["dataset_id"];
        this.datasets.push(form);
    }

    @action getCurrentDataset(index) {
        return this.datasets.find(item => item.dataset_id == index);
    }

    @action getMappedArray(dataset) {
        let datasetForm = [];
        Object.keys(dataset).map((key, i) => {
            if (Array.isArray(dataset[key])) {
                dataset[key].map((val, i) => {
                    if (!datasetForm[i]) {
                        datasetForm.push({[key]: val});
                    } else {
                        datasetForm[i][key] = val;
                    }
                });
            }
        });
        return datasetForm;
    }
    @action addRows(dataset) {
        Object.keys(dataset).map((key, i) => {
            if (Array.isArray(dataset[key])) {
                dataset[key].push("");
            }
        });
    }
    @action deleteRow = (dataset_id, index) => {
        let obj = this.datasets[dataset_id];
        Object.keys(obj).map(key => {
            if (Array.isArray(obj[key])) {
                obj[key].splice(index, 1);
            }
        });
    };

    @action saveDataset = (name, value, id, dataset_id) => {
        if (isNaN(value)) {
            this.datasets[dataset_id][name] = value;
        } else {
            this.datasets[dataset_id][name][id] = value;
        }
    };

    @action deleteDataset() {
        var index = this.datasets.findIndex(item => item.dataset_id == this.selectedDatasetIndex);
        if (index > -1) {
            this.datasets.splice(index, 1);
        }
        if (this.datasets.length) {
            let idArray = [];
            this.datasets.map(dataset => {
                idArray.push(dataset.dataset_id);
            });
            this.selectedDatasetIndex = idArray[0];
        }
    }

    @action saveAdverseDirection = (name, value, id) => {
        this.savedDataset.map((item, i) => {
            if (item.id == id) {
                item[name] = value;
            }
        });
    };

    @action toggleDataset = idx => {
        var obj = this.datasets.find(item => item.dataset_id == idx);
        obj["enabled"] = !obj["enabled"];
    };

    //returns the dataset which are enabled
    @computed get getEnabledDataset() {
        let obj = this.datasets.filter(item => item.enabled == true);
        return obj;
    }

    @action addanalysisForm = (name, value) => {
        this.analysisForm[name] = value;
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
                if (val.name === model && val.isChecked != checked) {
                    val.isChecked = !val.isChecked;
                } else if (
                    model.split("-")[1] == "All" &&
                    model.split("-")[0] == val.name.split("-")[0] &&
                    !val.isDisabled &&
                    val.isChecked != checked
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

    //returns enabled model types
    @computed get getModels() {
        let result = {};
        let models = toJS(this.getModelTypeList());

        models.map(item => {
            item.values.map(val => {
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

    @action
    async saveAnalysis() {
        const url = this.config.editSettings.patchInputUrl,
            getPayload = () => {
                return {
                    editKey: this.config.editSettings.editKey,
                    partial: true,
                    data: {
                        bmds_version: "BMDS312",
                        analysis_name: this.analysisForm.analysis_name,
                        analysis_description: this.analysisForm.analysis_description,
                        dataset_type: this.analysisForm.dataset_type,
                        models: this.getModels,
                        datasets: this.getEnabledDataset,
                        options: this.options,
                    },
                };
            };

        await fetch(url, {
            method: "PATCH",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(getPayload()),
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(data => this.updateModelStateFromApi(data));
                } else {
                    this.mainModal = !this.mainModal;
                    response.json().then(data => (this.modalMessage = data));
                }
            })
            .catch(error => {
                this.mainModal = !this.mainModal;
                this.modalMessage = error;
            });
    }

    @action.bound
    updateModelStateFromApi(data) {
        const inputs = data.inputs;
        if (_.isEmpty(inputs)) {
            return;
        }

        this.isExecuting = data.is_executing;
        this.isReadyToExecute = data.inputs_valid;
        if (data.outputs) {
            this.executionOutputs = data.outputs.outputs;
        }

        // unpack general settings
        this.analysisForm.analysis_name = inputs.analysis_name;
        this.analysisForm.analysis_description = inputs.analysis_description;
        this.analysisForm.dataset_type = inputs.dataset_type;
        this.options = inputs.options;

        // unpack datasets
        this.datasets = inputs.datasets;
        this.currentDataset = this.datasets[0];

        // unpack selected models
        let modelArr = [];
        Object.keys(inputs.models).map((item, i) => {
            inputs.models[item].map((val, index) => {
                if (item === "bayesian_model_average") {
                    val = val.model;
                }
                if (val == "Dichotomous-Hill") {
                    let [k, v] = val.split("-");
                    val = k + v;
                }
                val = item + "-" + val;
                modelArr.push(val);
            });
        });
        modelArr.forEach((item, i) => {
            let checked = true;
            let value = "";
            this.toggleModelsCheckBox(item, checked, value);
        });
    }

    @action
    async fetchSavedAnalysis() {
        const apiUrl = this.config.apiUrl;
        await fetch(apiUrl, {
            method: "GET",
            mode: "cors",
        })
            .then(response => response.json())
            .then(data => this.updateModelStateFromApi(data))
            .catch(error => {
                console.log("error", error);
            });
    }

    @observable isReadyToExecute = false;
    @observable isExecuting = false;
    @action
    async executeAnalysis() {
        if (!this.isReadyToExecute) {
            // don't execute if we're not ready
            return;
        }
        if (this.isExecuting) {
            // don't execute if we're already executing
            return;
        }
        this.isExecuting = true;
        await fetch(this.config.editSettings.executeUrl, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                editKey: this.config.editSettings.editKey,
            }),
        })
            .then(response => response.json())
            .then(data => {
                // TODO - fix this when we don't block and execution doesn't complete immediately
                this.updateModelStateFromApi(data);
            })
            .catch(error => {
                console.log("error", error);
            });
    }

    @observable selectedModelType = {};
    @observable goodnessFit = {};
    @observable cdfValues = [];
    @observable infoTable = {
        model_name: "",
        dataset_name: "",
        user_notes: "",
        dose_response_model: "",
    };
    @observable optionSettings = {};

    @observable modelData = {
        dependent_variable: "",
        independent_variable: "",
        number_of_observations: "",
    };
    @observable benchmarkDose = {
        bmd: "",
        bmdl: "",
        bmdu: "",
        aic: "",
        p_value: "",
        df: "",
        chi_square: "",
    };
    @observable parameters = [];
    @observable loglikelihoods = [];
    @observable test_of_interest = [];

    @action toggleModelDetailModal(output, model_index) {
        this.modelDetailModal = !this.modelDetailModal;
        if (this.modelDetailModal) {
            this.mapOutputModal(output, model_index);
        }
    }

    @action.bound
    mapOutputModal(output, model_index) {
        let selectedModel = output.models.find(row => row.model_index == model_index);
        this.selectedModelType = output.dataset.model_type;

        //unpack infoTable data
        this.infoTable.model_name = selectedModel.model_name;
        this.infoTable.dataset_name = output.dataset.dataset_name;
        this.infoTable.user_notes = output.dataset.dataset_description;
        this.infoTable.dose_response_model = this.getResponseModel;

        //unpack model Options
        delete selectedModel.settings["degree"];
        delete selectedModel.settings["background"];
        delete selectedModel.settings["adverseDirection"];
        delete selectedModel.settings["restriction"];
        delete selectedModel.settings["bLognormal"];
        delete selectedModel.settings["bUserParmInit"];
        this.optionSettings = selectedModel.settings;

        //unpack model_data
        this.modelData.dependent_variable = "Dose";
        this.modelData.independent_variable = "Response";
        this.modelData.number_of_observations = output.dataset.doses.length;

        //unpack benchmark dose
        this.benchmarkDose.bmd = selectedModel.results.bmd;
        this.benchmarkDose.bmdl = selectedModel.results.bmdl;
        this.benchmarkDose.bmdu = selectedModel.results.bmdu;
        this.benchmarkDose.aic = selectedModel.results.aic;
        this.benchmarkDose.p_value = selectedModel.results.gof.p_value;
        this.benchmarkDose.df = selectedModel.results.gof.df;
        this.benchmarkDose.chi_square = selectedModel.results.gof.chi_square;

        //godness of fit only for dichotomous
        if (this.selectedModelType == "D") {
            this.goodnessFit = selectedModel.results.gof.rows;
        } else if (this.selectedModelType == "CS") {
            this.goodnessFit = selectedModel.results.gof;
        }

        if (this.selectedModelType == "CS") {
            this.loglikelihoods = selectedModel.results.loglikelihoods;
            this.test_of_interest = selectedModel.results.test_rows;
        }

        let percentileValue = _.range(0.01, 1, 0.01);
        let cdf = selectedModel.results.cdf;
        let pValue = percentileValue.map(function(each_element) {
            return Number(each_element.toFixed(2));
        });

        this.cdfValues = _.zipWith(pValue, cdf, (pValue, cdf) => ({pValue, cdf}));

        //unpack paramters:
        let pvariables = this.getParameterVariables;
        this.parameters = _.zipWith(
            pvariables,
            selectedModel.results.parameters,
            (p_variable, parameter) => ({p_variable, parameter})
        );
    }

    //todo for other models
    @computed get getResponseModel() {
        let response_model = "";
        switch (this.infoTable.model_name) {
            case "Dichotomous-Hill":
                response_model = "P[dose] = g +(v-v*g)/[1+exp(-a-b*Log(dose))]";
                break;
            case "Gamma":
                response_model = "P[dose]= g+(1-g)*CumGamma[b*dose,a]";
        }

        return response_model;
    }

    //returns parameters variables based on models
    //todo for other models
    @computed get getParameterVariables() {
        let parameters = [];
        if (this.selectedModelType == "D") {
            if (this.infoTable.model_name === "Dichotomous-Hill") {
                parameters = this.parameter_variables.dichotomousHill;
            } else {
                parameters = this.parameter_variables.others;
            }
        } else if (this.selectedModelType == "CS") {
            if (this.infoTable.model_name === "Hill") {
                parameters = this.parameter_variables.hill;
            }
        }
        return parameters;
    }
    //todo for other models
    @observable parameter_variables = {
        dichotomousHill: ["a", "b", "c", "d"],
        others: ["a", "b", "c"],
        power: ["g", "v", "n"],
        hill: ["a", "b", "c", "d", "e", "f"],
        polynomial: ["g"],
    };

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
                    isChecked: false,
                },
                {
                    name: "Enable",
                    model_name: "frequentist_unrestricted",
                    colspan: "1",
                    type: "checkBox",
                    isChecked: false,
                },
                {
                    name: "Enable",
                    model_name: "bayesian",
                    colspan: "1",
                    type: "checkBox",
                    isChecked: false,
                },
                {
                    name: "Enable",
                    model_name: "bayesian_model_average",
                    colspan: "1",
                    type: "checkBox",
                    isChecked: false,
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

    @observable datasetLabels = {
        CSLabels: [
            {label: "Dose", name: "doses"},
            {label: "N", name: "ns"},
            {label: "Mean", name: "means"},
            {label: "St Dev", name: "stdevs"},
        ],
        CILabels: [
            {label: "Dose", name: "doses"},
            {label: "Response", name: "responses"},
        ],
        DILabels: [
            {label: "Dose", name: "doses"},
            {label: "N", name: "ns"},
            {label: "Incidence", name: "incidences"},
        ],
        NSLabels: [
            {label: "Dose", name: "doses"},
            {label: "Litter Size", name: "litter_sizes"},
            {label: "Incidence", name: "incidences"},
            {label: "Litter Specific Covariate", name: "litter_specific_covariates"},
        ],
    };
    @action getDatasetLabels(model_type) {
        let labels = [];
        switch (model_type) {
            case "CS":
                labels = this.datasetLabels.CSLabels;
                break;
            case "CI":
                labels = this.datasetLabels.CILabels;
                break;
            case "D":
                labels = this.datasetLabels.DILabels;
                break;
            case "N":
                labels = this.datasetLabels.NSLabels;
                break;
        }
        return labels;
    }
    @action getDatasetForm() {
        let form = {};
        switch (this.model_type) {
            case "CS":
                form = {
                    doses: ["", "", "", "", ""],
                    ns: ["", "", "", "", ""],
                    means: ["", "", "", "", ""],
                    stdevs: ["", "", "", "", ""],
                };
                break;
            case "CI":
                form = {
                    doses: ["", "", "", "", ""],
                    responses: ["", "", "", "", ""],
                };
                break;
            case "D":
                form = {
                    doses: ["", "", "", "", ""],
                    ns: ["", "", "", "", ""],
                    incidences: ["", "", "", "", ""],
                };
                break;
            case "N":
                form = {
                    doses: ["", "", "", "", ""],
                    litter_sizes: ["", "", "", "", ""],
                    incidences: ["", "", "", "", ""],
                    litter_specific_covariates: ["", "", "", "", ""],
                };

                break;
        }
        return form;
    }

    @observable getModelTypeList() {
        let models = [];
        if (this.analysisForm.dataset_type === "C") {
            models = this.CmodelType;
        } else if (this.analysisForm.dataset_type === "D") {
            models = this.DmodelType;
        }
        return models;
    }

    @action createOptions() {
        switch (this.analysisForm.dataset_type) {
            case "C":
                this.options.push(this.CSOptions);
                break;
            case "D":
                this.options.push(this.DIOptions);
                break;
        }
    }
    @observable DIOptions = {
        bmr_type: "Extra",
        bmr_value: "0.05",
        confidence_level: "0.95",
        background: "Estimated",
    };

    @observable CSOptions = {
        bmr_type: "Std. Dev.",
        bmr_value: 0.05,
        tail_probability: 0.8,
        confidence_level: 0.95,
        distribution: "Normal",
        variance: "Constant",
        polynomial_restriction: "Use dataset adverse direction",
        background: "Estimated",
    };

    @observable DatasetNamesHeader = ["Enable", "Datasets", "Adverse Direction"];

    @observable AdverseDirectionList = [
        {value: "automatic", name: "Automatic"},
        {value: "up", name: "Up"},
        {value: "down", name: "Down"},
    ];

    @observable DatasetTypes = [
        {value: "CS", name: "Continuous Summarized"},
        {value: "CI", name: "Continuous Individual"},
        {value: "D", name: "Dichotomous"},
        {value: "N", name: "Nested"},
    ];

    @computed get getDataLength() {
        return this.datasets.length;
    }
}

const store = new DataStore();
export default store;
