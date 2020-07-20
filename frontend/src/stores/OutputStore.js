import {observable, action} from "mobx";
import _ from "lodash";
import rootStore from "./RootStore";

class OutputStore {
    @observable modelDetailModal = false;
    @observable selectedModelType = {};
    @observable goodnessFitHeaders = [];
    @observable cdfValues = [];
    @observable infoTable = {
        model_name: {label: "Model Name", value: ""},
        dataset_name: {label: "Dataset Name", value: ""},
        user_notes: {label: "User Notes", value: ""},
        dose_response_model: {label: "Dose Response Model", value: ""},
    };
    @observable goodnessFit = [];
    @observable modelOptions = [];

    @observable modelData = {
        dependent_variable: {label: "Dependent Variable", value: "Dose"},
        independent_variable: {label: "Independent Variable", value: "Response"},
        number_of_observations: {label: "Number of Observations", value: ""},
    };
    @observable benchmarkDose = {
        bmd: {label: "BMD", value: ""},
        bmdl: {label: "BMDL", value: ""},
        bmdu: {label: "BMDU", value: ""},
        aic: {label: "AIC", value: ""},
        p_value: {label: "P Value", value: ""},
        df: {label: "DOF", value: ""},
    };
    @observable parameters = [];
    @observable response_models = [];
    @observable loglikelihoods = [];
    @observable test_of_interest = [];
    @observable selectedDatasetIndex = "";

    @action toggleModelDetailModal(output, model_index) {
        this.modelDetailModal = !this.modelDetailModal;
        if (this.modelDetailModal) {
            this.mapOutputModal(output, model_index);
        }
    }

    @action setCurrentDatasetIndex(dataset_id) {
        this.selectedDatasetIndex = dataset_id;
    }
    @action getExecutionOutputs() {
        return rootStore.mainStore.getExecutionOutputs();
    }
    @action getCurrentOutput(index) {
        let outputs = this.getExecutionOutputs();
        let currentOutputObject=null;
        if (outputs != null) {
            currentOutputObject = outputs.find(item => item.dataset.dataset_id == index);
        }
        return currentOutputObject
    }
    @action getDatasets() {
        return rootStore.dataStore.datasets;
    }
    @action getLabels(model_type) {
        return rootStore.dataStore.getDatasetLabels(model_type);
    }
    @action getMappingDataset(dataset) {
        return rootStore.dataStore.getMappingDataset(dataset);
    }
    @action.bound
    mapOutputModal(output, model_index) {
        let selectedModel = output.models.find(row => row.model_index == model_index);
        this.selectedModelType = output.dataset.model_type;
        this.setOutputValues(selectedModel, this.selectedModelType);
        this.setResponseModel(selectedModel.model_name);

        //unpack infoTable data
        this.infoTable.model_name.value = selectedModel.model_name;
        this.infoTable.dataset_name.value = output.dataset.dataset_name;
        this.infoTable.user_notes.value = output.dataset.dataset_description;

        //set model Optins values
        this.modelOptions.map(option => {
            option.value = selectedModel.settings[option.name];
        });

        this.modelData.number_of_observations.value = output.dataset.doses.length;

        //set benchmark dose values
        this.benchmarkDose.bmd.value = selectedModel.results.bmd;
        this.benchmarkDose.bmdl.value = selectedModel.results.bmdl;
        this.benchmarkDose.bmdu.value = selectedModel.results.bmdu;
        this.benchmarkDose.aic.value = selectedModel.results.aic;
        this.benchmarkDose.p_value.value = selectedModel.results.gof.p_value;
        this.benchmarkDose.df.value = selectedModel.results.gof.df;

        //set parameters values  TODO
        this.parameters = _.zipWith(
            this.parameter_variables,
            selectedModel.results.parameters,
            (p_variable, parameter) => ({p_variable, parameter})
        );

        //set cdf values with percentiles
        let percentileValue = _.range(0.01, 1, 0.01);
        let cdf = selectedModel.results.cdf;
        let pValue = percentileValue.map(function(each_element) {
            return Number(each_element.toFixed(2));
        });

        this.cdfValues = _.zipWith(pValue, cdf, (pValue, cdf) => ({pValue, cdf}));
    }

    @action setOutputValues(selectedModel, model_type) {
        switch (model_type) {
            case "CS":
                this.modelOptions = [
                    {label: "BMR Type", name: "bmrType", value: ""},
                    {label: "BMRF", name: "bmr", value: ""},
                    {label: "Tail Probability", name: "tailProb", value: ""},
                    {label: "Confidence Level", name: "alpha", value: ""},
                    {label: "Distribution Type", name: "distType", value: ""},
                    {label: "Variance Type", name: "varType", value: ""},
                ];
                this.goodnessFitHeaders = [
                    "Dose",
                    "Observed Mean",
                    "Observed SD",
                    "Calculated Median",
                    "Calculated SD",
                    "Estimated Median",
                    "Estimated SD",
                    "Size",
                    "Scaled Residual",
                ];
                this.loglikelihoods = selectedModel.results.loglikelihoods;
                this.test_of_interest = selectedModel.results.test_rows;
                this.modelData["adverse_direction"] = {
                    label: "Adverse Direction",
                    value: selectedModel.settings.adverseDirection,
                };
                this.goodnessFit = selectedModel.results.gof;
                break;
            case "DM":
                this.modelOptions = [
                    {label: "Risk Type", name: "bmrType", value: ""},
                    {label: "BMR", name: "bmr", value: ""},
                    {label: "Confidence Level", name: "alpha", value: ""},
                    {label: "Background", name: "background", value: ""},
                ];
                this.goodnessFitHeaders = [
                    "Dose",
                    "Estimated probability",
                    "Expected",
                    "Observed",
                    "Size",
                    "Scaled Residual",
                ];
                this.benchmarkDose["chi_square"] = {
                    label: "Chi Square",
                    value: selectedModel.results.gof.chi_square,
                };
                this.goodnessFit = selectedModel.results.gof.rows;
                break;
        }
    }

    //todo for other models
    @action setResponseModel(model_name) {
        switch (model_name) {
            case "Dichotomous-Hill":
                this.infoTable.dose_response_model.value =
                    "P[dose] = g +(v-v*g)/[1+exp(-a-b*Log(dose))]";
                this.parameter_variables = ["g", "v", "a", "b"];
                break;
            case "Gamma":
                this.infoTable.dose_response_model.value = "P[dose]= g+(1-g)*CumGamma[b*dose,a]";
                this.parameter_variables = ["g", "a", "b"];
                break;
            case "LogLogistic":
                this.infoTable.dose_response_model.value =
                    "P[dose] = g+(1-g)/[1+exp(-a-b*Log(dose))]";
                this.parameter_variables = ["g", "a", "b"];
                break;
            case "Log-Probit":
                this.infoTable.dose_response_model.value =
                    "P[dose] = g+(1-g) * CumNorm(a+b*Log(Dose))";
                this.parameter_variables = ["g", "a", "b"];
                break;
            case "Multistage": // multistage has multiple degree analysisi TODO
                this.infoTable.dose_response_model.value =
                    "P[dose] = g + (1-g)*[1-exp(-b1*dose^1-b2*dose^2 - ...)";
                this.parameter_variables = ["g", "b1", "b2"];
                break;
            case "Weibull":
                this.infoTable.dose_response_model.value = "P[dose] = g + (1-g)*[1-exp(-b*dose^a)]";
                this.parameter_variables = ["g", "a", "b"];
                break;
            case "Logistic":
                this.infoTable.dose_response_model.value = "P[dose] = 1/[1+exp(-a-b*dose)]";
                this.parameter_variables = ["a", "b"];
                break;
            case "Probit":
                this.infoTable.dose_response_model.value = "P[dose] = CumNorm(a+b*Dose)";
                this.parameter_variables = ["a", "b"];
                break;
            case "Quantal_Linear":
                this.infoTable.dose_response_model.value = "P[dose] = g + (1-g)*[1-exp(-b*dose)]";
                this.parameter_variables = ["g", "b"];
                break;
            case "Hill":
                this.infoTable.dose_response_model.value = "M[dose] = g + v*dose^n/(k^n + dose^n)";
                this.parameter_variables = ["g", "v", "k", "n", "alpha"];
                break;
            case "Power":
                this.infoTable.dose_response_model.value = "M[dose] = g + v * dose^n";
                this.parameter_variables = ["g", "v", "n", "alpha"];
                break;
            case "Linear":
                this.infoTable.dose_response_model.value = "M[dose] = g + b1*dose";
                this.parameter_variables = ["g", "beta1", "alpha"];
                break;
            case "Exponential": //exponential has multiple degree analysis TODO
                this.infoTable.dose_response_model.value = "TODO";
                this.parameter_variables = ["a", "b", "c"];
                break;
            case "Polynomial": //polynomial has multiple degree analysis TODO
                this.infoTable.dose_response_model.value = "TODO";
                this.parameter_variables = ["a", "b", "c"];
                break;
        }
    }
}

const outputStore = new OutputStore();
export default outputStore;
