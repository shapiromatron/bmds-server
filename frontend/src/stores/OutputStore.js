import {observable, action, computed} from "mobx";
import _ from "lodash";
import rootStore from "./RootStore";
import {toJS} from "mobx";

class OutputStore {
    @observable modelDetailModal = false;
    @observable selectedModelType = {};
    @observable goodnessFitHeaders = [];
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

    @action getExecutionOutputs() {
        return rootStore.mainStore.getExecutionOutputs();
    }

    @action.bound
    mapOutputModal(output, model_index) {
        this.infoTable = [];
        this.benchmarkDose = [];
        let selectedModel = output.models.find(row => row.model_index == model_index);
        this.selectedModelType = output.dataset.model_type;

        //unpack infoTable data
        this.model_name.value = selectedModel.model_name;
        this.dataset_name.value = output.dataset.dataset_name;
        this.user_notes.value = output.dataset.dataset_description;
        this.dose_response_model.value = this.getResponseModel;
        this.infoTable.push(
            this.model_name,
            this.dataset_name,
            this.user_notes,
            this.dose_response_model
        );

        //unpack model Options
        delete selectedModel.settings["degree"];
        delete selectedModel.settings["background"];
        delete selectedModel.settings["adverseDirection"];
        delete selectedModel.settings["restriction"];
        delete selectedModel.settings["bLognormal"];
        delete selectedModel.settings["bUserParmInit"];
        this.optionSettings = selectedModel.settings;

        //unpack model_data todo
        this.modelData.dependent_variable = "Dose";
        this.modelData.independent_variable = "Response";
        this.modelData.number_of_observations = output.dataset.doses.length;

        //unpack benchmark dose
        this.bmd.value = selectedModel.results.bmd;
        this.bmdl.value = selectedModel.results.bmdl;
        this.bmdu.value = selectedModel.results.bmdu;
        this.aic.value = selectedModel.results.aic;
        this.p_value.value = selectedModel.results.gof.p_value;
        this.df.value = selectedModel.results.gof.df;
        this.chi_square.value = selectedModel.results.gof.chi_square;
        this.benchmarkDose.push(
            this.bmd,
            this.bmdl,
            this.bmdu,
            this.aic,
            this.p_value,
            this.df,
            this.chi_square
        );

        this.getGoodessFitHeaders(this.selectedModelType);
        console.log(toJS(this.goodnessFitHeaders));
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

    @action getGoodessFitHeaders(model_type) {
        console.log("goodness headers called", model_type);
        switch (model_type) {
            case "CS":
                this.goodnessFitHeaders = [
                    "Dose",
                    "Size",
                    "Estimated Median",
                    "Calculated Median",
                    "Observed Mean",
                    "Estimated SD",
                    "Calculated SD",
                    "Observed SD",
                    "Scaled Residual",
                ];
                break;
            case "D":
                this.goodnessFitHeaders = [
                    "Dose",
                    "Size",
                    "Estimated probability",
                    "Expected",
                    "Observed",
                    "Scaled Residual",
                ];
        }
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

    @observable infoTable = [];
    @observable model_name = {label: "Model Name", value: ""};
    @observable dataset_name = {label: "Dataset Name", value: ""};
    @observable user_notes = {label: "User Notes", value: ""};
    @observable dose_response_model = {label: "Dose Response Model", value: ""};

    @observable benchmarkDose = [];
    @observable bmd = {label: "BMD", value: ""};
    @observable bmdl = {label: "BMDL", value: ""};
    @observable bmdu = {label: "BMDU", value: ""};
    @observable aic = {label: "AIC", value: ""};
    @observable p_value = {label: "P Value", value: ""};
    @observable df = {label: "DOF", value: ""};
    @observable chi_square = {label: "Chi Square", value: ""};
}

const outputStore = new OutputStore();
export default outputStore;
