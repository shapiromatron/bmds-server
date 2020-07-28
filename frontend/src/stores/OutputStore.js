import {observable, action, computed} from "mobx";
import _ from "lodash";
import {toJS} from "mobx";
import rootStore from "./RootStore";

class OutputStore {
    @observable modelDetailModal = false;
    @observable selectedModelType = {};
    @observable selectedModel = {};
    @observable goodnessFitHeaders = [];
    @observable cdf = [];
    @observable pValue = [];
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
        independent_variable: {label: "Independent Variable", value: "Mean"},
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
        console.log("outputs fsdfs", toJS(outputs));
        let currentOutputObject = null;
        if (outputs) {
            console.log("outputs if ");
            currentOutputObject = outputs.find(item => item.dataset.dataset_id == index);
        }
        return currentOutputObject;
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
        this.selectedModel = output.models.find(row => row.model_index == model_index);
        this.selectedModelType = output.dataset.model_type;
        this.setResponseModel(this.selectedModel.model_name);
        this.setOutputValues(this.selectedModel, this.selectedModelType);

        //unpack infoTable data
        this.infoTable.model_name.value = this.selectedModel.model_name;
        this.infoTable.dataset_name.value = output.dataset.dataset_name;
        this.infoTable.user_notes.value = output.dataset.dataset_description;

        //set model Optins values
        this.modelOptions.map(option => {
            option.value = this.selectedModel.settings[option.name];
        });

        this.modelData.number_of_observations.value = output.dataset.doses.length;

        //set benchmark dose values
        this.benchmarkDose.bmd.value = this.selectedModel.results.bmd;
        this.benchmarkDose.bmdl.value = this.selectedModel.results.bmdl;
        this.benchmarkDose.bmdu.value = this.selectedModel.results.bmdu;
        this.benchmarkDose.aic.value = this.selectedModel.results.aic;
        this.benchmarkDose.p_value.value = this.selectedModel.results.gof.p_value;
        this.benchmarkDose.df.value = this.selectedModel.results.gof.df;

        this.bmd = this.benchmarkDose.bmd.value;
        this.bmdl = this.benchmarkDose.bmdl.value;

        //set parameters values  TODO
        this.parameters = _.zipWith(
            this.parameter_variables,
            this.selectedModel.results.parameters,
            (p_variable, parameter) => ({p_variable, parameter})
        );

        //set cdf values with percentiles
        let cdf = this.selectedModel.results.cdf;
        let pValue = this.getPValue;

        this.cdfValues = _.zipWith(pValue, cdf, (pValue, cdf) => ({pValue, cdf}));
    }

    @computed get getPValue() {
        let percentileValue = _.range(0.01, 1, 0.01);
        let pValue = percentileValue.map(function(each_element) {
            return Number(each_element.toFixed(2));
        });
        return pValue;
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
                this.infoTable["variance_model"] = {
                    label: "Variance Model",
                    value: this.variance_model,
                };
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
                this.variance_model = "Var[i]=alpha";
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

    @observable plotData = [];
    @action setPlotData() {
        this.plotData = [];
        let output = this.getCurrentOutput(this.selectedDatasetIndex);
        if (output == null || "error" in output) {
            return output;
        }
        let doses = output.dataset.doses;
        let mean = output.dataset.means;
        let stdevs = output.dataset.stdevs;
        let ns = output.dataset.ns;
        let errorbars = [];
        for (var i = 0; i < stdevs.length; i++) {
            var value = stdevs[i] / Math.sqrt(ns[i]);
            errorbars.push(value);
        }
        var trace1 = {
            x: doses,
            y: mean,
            error_y: {
                type: "data",
                array: errorbars,
                visible: true,
            },
            mode: "markers",
            type: "scatter",
            name: "estimated probability",
        };
        this.plotData.push(trace1);
    }
    @observable layout = {
        title: {
            text: "",
            font: {
                family: "Courier New, monospace",
                size: 12,
            },
            xref: "paper",
            x: 0.05,
        },
        xaxis: {
            title: {
                text: "Dose (mg/kg-day)",
                font: {
                    family: "Courier New, monospace",
                    size: 14,
                    color: "#7f7f7f",
                },
            },
        },
        yaxis: {
            title: {
                text: "Response (mg/dL)",
                font: {
                    family: "Courier New, monospace",
                    size: 14,
                    color: "#7f7f7f",
                },
            },
        },
    };

    @action addPlotData = index => {
        let output = this.getCurrentOutput(this.selectedDatasetIndex);
        let currentModel = output.models.find(item => item.model_index == index);
        let cdf = currentModel.results.cdf;
        let doses = output.dataset.doses;

        let doseRange = _.max(doses) - _.min(doses);
        let pValue = this.getPValue;
        let xArray = [];
        pValue.map(item => {
            let new_item = (item / 100) * doseRange;
            xArray.push(new_item);
        });

        var trace2 = {
            x: xArray,
            y: cdf,
            mode: "marker",
            type: "line",
        };

        this.plotData.push(trace2);
    };
    @action clearPlotData = () => {
        this.plotData.pop();
    };

    @observable est_probability = [1, 2, 3, 4];
    @observable response_at_bmd = [1, 2, 3, 4];
    @observable data = [1, 2, 3, 4];
    @observable bmd = "";
    @observable bmdl = "";
}

const outputStore = new OutputStore();
export default outputStore;
