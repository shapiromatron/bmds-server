import {observable, action, computed} from "mobx";
import _ from "lodash";
import * as constant from "../constants/outputConstants";

class OutputStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable modelDetailModal = false;
    @observable selectedModel = {};
    @observable selectedDatasetIndex = "";
    @observable plotData = [];
    @observable showBMDLine = false;

    @action setCurrentDatasetIndex(dataset_id) {
        this.selectedDatasetIndex = dataset_id;
    }
    @action toggleModelDetailModal(model) {
        this.selectedModel = model;
        this.modelDetailModal = !this.modelDetailModal;
    }

    @computed get getCurrentOutput() {
        let outputs = this.rootStore.mainStore.getExecutionOutputs;
        let current_output = null;
        if (outputs) {
            current_output = outputs.find(
                item => item.dataset.dataset_id == this.selectedDatasetIndex
            );
        }
        return current_output;
    }
    @computed get getModelType() {
        return this.getCurrentOutput.dataset.model_type;
    }

    @computed get getLabels() {
        return this.rootStore.dataStore.getLabels;
    }

    @computed get getMappedDatasets() {
        let datasetInputForm = [];
        Object.keys(this.getCurrentOutput.dataset).map(key => {
            if (Array.isArray(this.getCurrentOutput.dataset[key])) {
                this.getCurrentOutput.dataset[key].map((val, i) => {
                    if (!datasetInputForm[i]) {
                        datasetInputForm.push({[key]: val});
                    } else {
                        datasetInputForm[i][key] = val;
                    }
                });
            }
        });
        return datasetInputForm;
    }

    @computed get getInfoTable() {
        let infoTable = _.cloneDeep(constant.infoTable);
        infoTable.model_name.value = this.selectedModel.model_name;
        infoTable.dataset_name.value = this.getCurrentOutput.dataset.dataset_name;
        infoTable.dose_response_model.value =
            constant.dose_response_model[this.selectedModel.model_name];
        return infoTable;
    }

    @computed get getModelOptions() {
        let modelOptions = _.cloneDeep(
            constant.model_options[this.getCurrentOutput.dataset.model_type]
        );
        modelOptions.map(option => {
            option.value = this.selectedModel.settings[option.name];
            if (option.name == "bmrType") {
                option.value = constant.bmrType[option.value];
            }
            if (option.name == "distType") {
                option.value = constant.distType[option.value];
            }
            if (option.name == "varType") {
                option.value = constant.varType[option.value];
            }
        });
        return modelOptions;
    }

    @computed get getModelData() {
        let modelData = _.cloneDeep(constant.modelData);
        modelData.number_of_observations.value = this.getCurrentOutput.dataset.doses.length;
        modelData.adverse_direction.value =
            constant.adverse_direction[this.selectedModel.settings.adverseDirection];
        return modelData;
    }

    @computed get getBenchmarkDose() {
        let benchmarkDose = _.cloneDeep(constant.benchmarkDose);
        benchmarkDose.bmd.value = this.selectedModel.results.bmd;
        benchmarkDose.bmdl.value = this.selectedModel.results.bmdl;
        benchmarkDose.bmdu.value = this.selectedModel.results.bmdu;
        benchmarkDose.aic.value = this.selectedModel.results.aic;
        benchmarkDose.p_value.value = this.selectedModel.results.gof.p_value;
        benchmarkDose.df.value = this.selectedModel.results.gof.df;
        if (this.getCurrentOutput.dataset.model_type === "DM") {
            benchmarkDose["chi_square"] = {
                label: "Chi Square",
                value: this.selectedModel.results.gof.chi_square,
            };
        }
        return benchmarkDose;
    }

    @computed get getParameters() {
        let parameters = _.zipWith(
            constant.parameters[this.selectedModel.model_name],
            this.selectedModel.results.parameters,
            (p_variable, parameter) => ({p_variable, parameter})
        );

        return parameters;
    }
    @computed get getCDFValues() {
        let cdf = this.selectedModel.results.cdf;
        let pValue = this.getPValue;
        let cdfValues = _.zipWith(pValue, cdf, (pValue, cdf) => ({pValue, cdf}));
        return cdfValues;
    }

    @computed get getLoglikelihoods() {
        return this.selectedModel.results.loglikelihoods;
    }

    @computed get getTestofInterest() {
        let rows = this.selectedModel.results.test_rows;
        return rows;
    }

    @computed get getPValue() {
        let percentileValue = _.range(0.01, 1, 0.01);
        let pValue = percentileValue.map(function(each_element) {
            return Number(each_element.toFixed(2));
        });
        return pValue;
    }
    @computed get getGoodnessFitHeaders() {
        return constant.goodnessFitHeaders[this.getCurrentOutput.dataset.model_type];
    }
    @computed get getGoodnessFit() {
        let goodnessFit = [];
        if (this.getCurrentOutput.dataset.model_type === "CS") {
            goodnessFit = this.selectedModel.results.gof;
        } else if (this.this.getCurrentOutput.dataset.model_type === "DM") {
            goodnessFit = this.selectedModel.results.gof.rows;
        }
        return goodnessFit;
    }

    @observable scatterPlotData = [];

    @computed get getResponse() {
        let responses = [];
        let dataset = this.getCurrentOutput.dataset;
        let ns = dataset.ns;
        let incidences = dataset.incidences;
        if (dataset.model_type === "CS") {
            responses = dataset.means;
        } else if (dataset.model_type === "DM") {
            for (var i = 0; i < ns.length; i++) {
                var response = incidences[i] / ns[i];
                responses.push(response);
            }
        }
        return responses;
    }

    @computed get getLayout() {
        return constant.layout;
    }

    @computed get getCDFLayout() {
        return constant.cdf_layout;
    }
    @computed get getCDFPlot() {
        var trace1 = {
            x: this.getPValue,
            y: this.selectedModel.results.cdf,
            mode: "markers",
            type: "scatter",
            name: "CDF",
        };
        let cdfPlot = [trace1];
        return cdfPlot;
    }
    @action setPlotData() {
        this.plotData = [];
        var trace1 = {
            x: this.getCurrentOutput.dataset.doses.slice(),
            y: this.getResponse.slice(),
            mode: "markers",
            type: "scatter",
            name: "Response",
        };
        this.plotData.push(trace1);
    }

    @action addBMDLine(model) {
        let param_variables = constant.parameters[model.model_name];
        let parameters = model.results.parameters;
        let param = parameters.reduce(function(result, field, index) {
            result[param_variables[index]] = field;
            return result;
        }, {});
        let response = constant.generateLine[model.model_name](this.getDoseArray, param);
        let bmdLine = {
            x: this.getDoseArray,
            y: response,
            mode: "markers+line",
            type: "line",
            name: model.model_name,
        };
        this.plotData.push(bmdLine);
    }

    @action removeBMDLine() {
        if (this.plotData.length > 1) {
            this.plotData.pop();
        }
    }

    @computed get getDoseArray() {
        let maxDose = _.max(this.getCurrentOutput.dataset.doses);
        let minDose = _.min(this.getCurrentOutput.dataset.doses);
        let number_of_values = 100;
        var doseArr = [];
        var step = (maxDose - minDose) / (number_of_values - 1);
        for (var i = 0; i < number_of_values; i++) {
            doseArr.push(minDose + step * i);
        }
        return doseArr;
    }
}

export default OutputStore;
