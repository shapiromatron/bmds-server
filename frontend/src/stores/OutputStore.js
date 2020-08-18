import {observable, action, computed} from "mobx";
import _ from "lodash";
import * as constant from "../constants/outputConstants";

class OutputStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable currentOutput;
    @observable labels = [];
    @observable mappedDatasets = [];
    @observable modelDetailModal = false;
    @observable selectedModelType = {};
    @observable selectedModel = {};
    @observable goodnessFitHeaders = [];
    @observable cdf = [];
    @observable pValue = [];
    @observable cdfValues = [];
    @observable infoTable = {};
    @observable goodnessFit = [];
    @observable modelOptions = [];
    @observable modelData = {};
    @observable benchmarkDose = {};
    @observable parameters = [];
    @observable response_models = [];
    @observable loglikelihoods = [];
    @observable test_of_interest = [];
    @observable selectedDatasetIndex = "";
    @observable currentDataset = {};
    @observable plotData = [];

    @action setDefaultState() {
        let outputs = this.rootStore.mainStore.getExecutionOutputs;
        if (outputs) {
            this.currentOutput = outputs.find(
                item => item.dataset.dataset_id == this.selectedDatasetIndex
            );
            this.labels = this.rootStore.dataStore.getDatasetLabels(
                this.currentOutput.dataset.model_type
            );
            this.mappedDatasets = this.rootStore.dataStore.getMappingDataset(
                this.currentOutput.dataset
            );
        }
    }

    @action setCurrentDatasetIndex(dataset_id) {
        this.selectedDatasetIndex = dataset_id;
        this.setDefaultState();
        this.setPlotData();
    }

    @action toggleModelDetailModal(model_index) {
        this.modelDetailModal = !this.modelDetailModal;
        if (this.modelDetailModal) {
            this.mapOutputModal(model_index);
        }
    }

    @action.bound
    mapOutputModal(model_index) {
        this.selectedModel = this.currentOutput.models.find(row => row.model_index == model_index);
        this.selectedModelType = this.currentOutput.dataset.model_type;

        //unpack infoTable data
        this.infoTable = _.cloneDeep(constant.infoTable);
        this.infoTable.model_name.value = this.selectedModel.model_name;
        this.infoTable.dataset_name.value = this.currentOutput.dataset.dataset_name;
        this.infoTable.dose_response_model.value =
            constant.dose_response_model[this.selectedModel.model_name];

        //set model Optins values
        this.modelOptions = _.cloneDeep(constant.model_options[this.selectedModelType]);
        this.modelOptions.map(option => {
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

        this.modelData = _.cloneDeep(constant.modelData);
        this.modelData.number_of_observations.value = this.currentOutput.dataset.doses.length;
        this.modelData.adverse_direction.value =
            constant.adverse_direction[this.selectedModel.settings.adverseDirection];

        //set benchmark dose values
        this.benchmarkDose = _.cloneDeep(constant.benchmarkDose);
        this.benchmarkDose.bmd.value = this.selectedModel.results.bmd;
        this.benchmarkDose.bmdl.value = this.selectedModel.results.bmdl;
        this.benchmarkDose.bmdu.value = this.selectedModel.results.bmdu;
        this.benchmarkDose.aic.value = this.selectedModel.results.aic;
        this.benchmarkDose.p_value.value = this.selectedModel.results.gof.p_value;
        this.benchmarkDose.df.value = this.selectedModel.results.gof.df;
        if (this.selectedModelType === "DM") {
            this.benchmarkDose["chi_square"] = {
                label: "Chi Square",
                value: this.selectedModel.results.gof.chi_square,
            };
        }

        //set parameters values  TODO
        this.parameters = _.zipWith(
            constant.parameters[this.selectedModel.model_name],
            this.selectedModel.results.parameters,
            (p_variable, parameter) => ({p_variable, parameter})
        );

        this.goodnessFit = this.getGoodnessFit;

        if (this.selectedModelType === "CS") {
            this.loglikelihoods = this.selectedModel.results.loglikelihoods;
            this.test_of_interest = this.selectedModel.results.test_rows;
        }

        //set cdf values with percentiles
        this.cdf = this.selectedModel.results.cdf;
        this.pValue = this.getPValue;
        this.cdfValues = _.zipWith(this.pValue, this.cdf, (pValue, cdf) => ({pValue, cdf}));
        this.setCDFPlot();
    }

    @computed get getPValue() {
        let percentileValue = _.range(0.01, 1, 0.01);
        let pValue = percentileValue.map(function(each_element) {
            return Number(each_element.toFixed(2));
        });
        return pValue;
    }
    @computed get getGoodnessFitHeaders() {
        return constant.goodnessFitHeaders[this.selectedModelType];
    }
    @computed get getGoodnessFit() {
        let goodnessFit = [];
        if (this.selectedModelType === "CS") {
            goodnessFit = this.selectedModel.results.gof;
        } else if (this.selectedModelType === "DM") {
            goodnessFit = this.selectedModel.results.gof.rows;
        }
        return goodnessFit;
    }

    @action setPlotData() {
        this.setDefaultState();
        this.plotData = [];
        var trace1 = {
            x: this.currentOutput.dataset.doses,
            y: this.getResponse,
            mode: "markers",
            type: "scatter",
            name: "Response",
        };
        this.plotData.push(trace1);
    }

    @computed get getResponse() {
        let responses = [];
        let ns = this.currentOutput.dataset.ns;
        let incidences = this.currentOutput.dataset.incidences;
        if (this.currentOutput.dataset.model_type === "CS") {
            responses = this.currentOutput.dataset.means;
        } else if (this.currentOutput.dataset.model_type === "DM") {
            for (var i = 0; i < ns.length; i++) {
                var response = incidences[i] / ns[i];
                responses.push(response);
            }
        }
        return responses;
    }

    @computed get getLayout() {
        return constant.scatter_plot_layout;
    }

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

    @computed get getCDFPlotLayout() {
        return constant.cdf_plot_layout;
    }

    @action addBMDLine = model => {
        let param_variables = constant.parameters[model.model_name];
        let parameters = model.results.parameters;
        let param = parameters.reduce(function(result, field, index) {
            result[param_variables[index]] = field;
            return result;
        }, {});
        let response = constant.generateLine[model.model_name](this.getDoseArrar, param);
        let bmdLine = {
            x: this.getDoseArrar,
            y: response,
            mode: "markers",
            type: "line",
            name: model.model_name,
        };
        this.plotData.push(bmdLine);
    };

    @action removeBMDLine = () => {
        this.plotData.pop();
    };

    @computed get getDoseArrar() {
        let maxDose = _.max(this.currentOutput.dataset.doses);
        let minDose = _.min(this.currentOutput.dataset.doses);
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
