import {observable, action, computed} from "mobx";
import _ from "lodash";

import * as dc from "../constants/dataConstants";
import * as constant from "../constants/outputConstants";

class OutputStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable modelDetailModal = false;
    @observable selectedModel = null;
    @observable currentOutput = {};
    @observable selectedDatasetIndex = 0;
    @observable plotData = [];
    @observable showBMDLine = false;

    @action setSelectedModel(model) {
        this.selectedModel = model;
    }
    @action setSelectedDatasetIndex(dataset_id) {
        this.selectedDatasetIndex = dataset_id;
        this.setPlotData();
    }
    @action toggleModelDetailModal(model) {
        this.setSelectedModel(model);
        this.modelDetailModal = !this.modelDetailModal;
    }

    @computed get selectedDataset() {
        return this.getCurrentOutput.dataset;
    }

    @computed get getCurrentOutput() {
        let outputs = this.rootStore.mainStore.getExecutionOutputs;

        if (outputs === null) {
            return null;
        }

        let current_output = outputs.find(
            item => item.dataset.dataset_id == this.selectedDatasetIndex
        );
        return current_output;
    }

    @computed get getDatasetColumns() {
        return this.rootStore.dataStore.getDatasetColumns;
    }

    @computed get getInfoTable() {
        let infoTable = _.cloneDeep(constant.infoTable);
        infoTable.model_name.value = this.selectedModel.model_name;
        infoTable.dataset_name.value = this.getCurrentOutput.dataset.dataset_name;
        infoTable.dose_response_model.value = this.selectedModel.results.fit.model.model_form_str;
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

    @computed get getResponse() {
        let responses = [];
        let dataset = this.getCurrentOutput.dataset;
        let ns = dataset.ns;
        let incidences = dataset.incidences;
        if (dataset.model_type === dc.DATA_CONTINUOUS_SUMMARY) {
            responses = dataset.means;
        } else if (dataset.model_type === dc.DATA_DICHOTOMOUS) {
            for (var i = 0; i < ns.length; i++) {
                var response = incidences[i] / ns[i];
                responses.push(response);
            }
        }
        return responses;
    }

    @computed get getLayout() {
        let layout = _.cloneDeep(constant.layout);
        layout.title.text = this.getCurrentOutput.dataset.dataset_name;
        return layout;
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
        const bmdLine = {
            x: model.results.dr_x,
            y: model.results.dr_y,
            mode: "lines",
            name: model.model_name,
            line: {
                width: 4,
            },
        };

        this.plotData.push(bmdLine);
    }

    @action removeBMDLine() {
        if (this.plotData.length > 1) {
            this.plotData.pop();
        }
    }

    @computed get selectedParams() {
        let names = this.selectedModel.results.fit.model.params,
            values = this.selectedModel.results.fit.params.toJS();
        return _.zipObject(names, values);
    }

    @computed get doseArray() {
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
