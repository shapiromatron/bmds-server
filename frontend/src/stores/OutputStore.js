import {observable, action, computed} from "mobx";
import _ from "lodash";

import {getDrLayout, getDrDatasetPlotData} from "../constants/plotting";
import * as constant from "../constants/outputConstants";

class OutputStore {
    /*
    An `Output` are the modeling results that are a permutation of a dataset and an option-set.
    */
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable modelDetailModal = false;
    @observable selectedModel = null;
    @observable currentOutput = {};
    @observable selectedOutputIndex = 0;
    @observable plotData = [];
    @observable showBMDLine = false;

    @action setSelectedModel(model) {
        this.selectedModel = model;
    }
    @action setSelectedDatasetIndex(dataset_id) {
        this.selectedDatasetIndex = dataset_id;
    }

    @action toggleModelDetailModal(model) {
        this.modelDetailModal = !this.modelDetailModal;
        if (this.modelDetailModal) {
            this.selectedModel = model;
        } else {
            this.selectedModel = null;
            this.plotData.pop();
        }
    }

    @computed get outputs() {
        return this.rootStore.mainStore.getExecutionOutputs;
    }
    @computed get selectedOutput() {
        if (this.outputs === null) {
            return null;
        }
        return this.outputs[this.selectedOutputIndex];
    }
    @computed get selectedDataset() {
        const dataset_index = this.selectedOutput.dataset_index;
        return this.rootStore.dataStore.datasets[dataset_index];
    }

    @computed get getModelOptions() {
        let modelOptions = _.cloneDeep(constant.model_options[this.selectedDataset.model_type]);
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
        modelData.number_of_observations.value = this.selectedDataset.doses.length;
        modelData.adverse_direction.value =
            constant.adverse_direction[this.selectedModel.settings.adverseDirection];
        return modelData;
    }

    @computed get getPValue() {
        let percentileValue = _.range(0.01, 1, 0.01);
        let pValue = percentileValue.map(function(each_element) {
            return Number(each_element.toFixed(2));
        });
        return pValue;
    }

    @computed get drPlotLayout() {
        return getDrLayout(this.selectedDataset);
    }

    @computed get drPlotData() {
        return getDrDatasetPlotData(this.selectedDataset);
    }

    @computed get selectedParams() {
        let names = this.selectedModel.model_class.params,
            values = this.selectedModel.results.fit.params.toJS();
        return _.zipObject(names, values);
    }

    @computed get doseArray() {
        let maxDose = _.max(this.selectedDataset.doses);
        let minDose = _.min(this.selectedDataset.doses);
        let number_of_values = 100;
        var doseArr = [];
        var step = (maxDose - minDose) / (number_of_values - 1);
        for (var i = 0; i < number_of_values; i++) {
            doseArr.push(minDose + step * i);
        }
        return doseArr;
    }

    @action.bound saveSelectedModelIndex(idx) {
        this.selectedOutput.selected_model_index = idx;

        if (this.plotData.length > 1) {
            this.plotData.pop();
        }
        if (idx > -1) {
            let model = this.selectedOutput.models[idx];
            this.addBmdLine(model, "#0000FF");
        }
    }

    @action.bound saveSelectedIndexNotes(value) {
        this.selectedOutput.selected_model_notes = value;
    }

    @action.bound saveSelectedModel() {
        // api call to update
        console.warn("implement!");
    }

    getOutputName(idx) {
        /*
        Not @computed because it has a parameter, this is still observable; prevents caching;
        source: https://mobx.js.org/computeds-with-args.html
        */
        const output = this.outputs[idx],
            dataset = this.rootStore.dataStore.datasets[output.dataset_index];

        if (this.rootStore.optionsStore.optionsList.length > 1) {
            return `${dataset.metadata.name}: Option Set ${output.option_index + 1}`;
        } else {
            return dataset.metadata.name;
        }
    }
}

export default OutputStore;
