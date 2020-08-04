import {observable, action, computed} from "mobx";
import _ from "lodash";
import rootStore from "./RootStore";
import * as constant from "../constants/outputConstants";

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
    @computed get getExecutionOutputs() {
        return rootStore.mainStore.getExecutionOutputs();
    }
    @observable currentOutputObject = {};
    @action getCurrentOutput(index) {
        let outputs = this.getExecutionOutputs;
        let currentOutputObject = null;
        if (outputs) {
            currentOutputObject = outputs.find(item => item.dataset.dataset_id == index);
            this.currentOutputObject = outputs.find(item => item.dataset.dataset_id == index);
        }
        return currentOutputObject;
    }
    @action getDatasets() {
        let outputs = this.getExecutionOutputs;
        let datasetList = [];
        if (outputs) {
            outputs.map(item => {
                datasetList.push(item.dataset);
            });
        }
        return datasetList;
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
        this.cdf = this.selectedModel.results.cdf;
        this.pValue = this.getPValue;

        this.cdfValues = _.zipWith(this.pValue, this.cdf, (pValue, cdf) => ({pValue, cdf}));
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
                this.parameter_variables = ["g", "b1", "alpha"];
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

    @action getScatterPlotData(currentDataset) {
        let model_type = currentDataset.model_type;
        switch (model_type) {
            case "CS":
                this.getCSScatterPlot(currentDataset);
                break;
            case "DM":
                this.getDMScatterPlot(currentDataset);
                break;
            default:
                break;
        }
    }

    @observable plotData = [];
    @action getCSScatterPlot(currentDataset) {
        this.plotData = [];
        let doses = currentDataset.doses;
        let mean = currentDataset.means;
        let stdevs = currentDataset.stdevs;
        let ns = currentDataset.ns;
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
            mode: "markers+lines",
            type: "scatter",
            name: "Response",
        };
        this.plotData.push(trace1);
    }
    @action getDMScatterPlot(currentDataset) {
        this.plotData = [];
        let doses = currentDataset.doses;
        let incidences = currentDataset.incidences;
        let ns = currentDataset.ns;
        let responses = [];
        for (var i = 0; i < ns.length; i++) {
            var response = incidences[i] / ns[i];
            responses.push(response);
        }
        var trace1 = {
            x: doses,
            y: responses,
            mode: "markers+lines",
            type: "scatter",
            name: "Response",
        };
        this.plotData.push(trace1);
    }
    @observable layout = {
        showlegend: true,
        title: {
            text: "",
            font: {
                family: "Courier New, monospace",
                size: 12,
            },
            xref: "paper",
        },
        xaxis: {
            linecolor: "black",
            linewidth: 1,
            mirror: true,
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
            linecolor: "black",
            linewidth: 1,
            mirror: true,
            title: {
                text: "Response (mg/dL)",
                font: {
                    family: "Courier New, monospace",
                    size: 14,
                    color: "#7f7f7f",
                },
            },
        },
        plot_bgcolor: "",
        paper_bgcolor: "#eee",
    };

    @observable cdfPlot = [];
    @action setCDFPlot() {
        this.cdfPlot = [];
        var trace1 = {
            x: this.pValue,
            y: this.cdf,
            mode: "markers",
            type: "scatter",
            name: "CDF",
        };
        this.cdfPlot.push(trace1);
    }
    @observable cdfLayout = {
        showlegend: true,
        title: {
            text: "CDF Plot",
            font: {
                family: "Courier New, monospace",
                size: 16,
            },
            xref: "paper",
        },
        xaxis: {
            linecolor: "black",
            linewidth: 1,
            mirror: true,
            title: {
                text: "Percentile",
                font: {
                    family: "Courier New, monospace",
                    size: 14,
                    color: "#7f7f7f",
                },
            },
        },
        yaxis: {
            linecolor: "black",
            linewidth: 1,
            mirror: true,
            title: {
                text: "CDF",
                font: {
                    family: "Courier New, monospace",
                    size: 14,
                    color: "#7f7f7f",
                },
            },
        },
        plot_bgcolor: "",
        paper_bgcolor: "#eee",
    };

    @observable currentModel;
    @observable currentDataset;
    @observable model_index;
    @observable param = {};
    @observable bmdLine = {};
    @action addBMDLine = model => {
        this.setResponseModel(model.model_name);
        let param_variables = this.parameter_variables;
        let parameters = model.results.parameters;
        this.param = parameters.reduce(function(result, field, index) {
            result[param_variables[index]] = field;
            return result;
        }, {});
        let maxDose = _.max(this.currentOutputObject.dataset.doses);
        let minDose = _.min(this.currentOutputObject.dataset.doses);
        let number_of_values = 100;
        var doseArr = [];
        var step = (maxDose - minDose) / (number_of_values - 1);
        for (var i = 0; i < number_of_values; i++) {
            doseArr.push(minDose + step * i);
        }
        let response = this.getBMDLine(model.model_name, doseArr);
        this.bmdLine = {
            x: doseArr,
            y: response,
            mode: "marker",
            type: "line",
            name: model.model_name,
        };
    };
    @action removeBMDLine = () => {
        this.bmdLine = {};
    };

    @action getBMDLine(model_name, doseArr) {
        return constant.generateLine[model_name](doseArr, this.param);
    }
}

const outputStore = new OutputStore();
export default outputStore;
