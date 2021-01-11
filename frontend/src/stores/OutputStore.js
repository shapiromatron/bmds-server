import {observable, action, computed} from "mobx";
import _ from "lodash";

import {getDrLayout, getDrDatasetPlotData, getDrBmdLine} from "../constants/plotting";
import * as constant from "../constants/outputConstants";

class OutputStore {
    /*
    An `Output` are the modeling results that are a permutation of a dataset and an option-set.
    */
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable showModelModal = false;
    @observable modalModel = null;
    @observable currentOutput = {};
    @observable selectedOutputIndex = 0;
    @observable drModelHover = null;
    @observable drModelModal = null;
    @observable drModelSelected = null;

    @observable showBMDLine = false;

    @action setSelectedDatasetIndex(dataset_id) {
        this.selectedDatasetIndex = dataset_id;
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
            option.value = this.modalModel.settings[option.name];
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
            constant.adverse_direction[this.modalModel.settings.adverseDirection];
        return modelData;
    }

    @computed get getPValue() {
        let percentileValue = _.range(0.01, 1, 0.01);
        let pValue = percentileValue.map(function(each_element) {
            return Number(each_element.toFixed(2));
        });
        return pValue;
    }

    @computed get selectedParams() {
        let names = this.modalModel.model_class.params,
            values = this.modalModel.results.fit.params.toJS();
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

    // start modal methods
    @action.bound showModalDetail(model) {
        this.modalModel = model;
        this.drModelModal = getDrBmdLine(model, "#0000FF");
        this.showModelModal = true;
    }
    @action.bound closeModal() {
        this.modalModel = null;
        this.drModelModal = null;
        this.showModelModal = false;
    }
    // end modal methods

    // start dose-response plotting data methods
    @computed get drPlotLayout() {
        return getDrLayout(this.selectedDataset);
    }
    @computed get drPlotData() {
        const data = [getDrDatasetPlotData(this.selectedDataset)];
        if (this.drModelHover) {
            data.push(this.drModelHover);
        }
        if (this.drModelModal) {
            data.push(this.drModelModal);
        }
        if (this.drModelSelected) {
            data.push(this.drModelSelected);
        }
        return data;
    }
    @action.bound drPlotAddHover(model) {
        this.drModelHover = getDrBmdLine(model, "#DA2CDA");
    }
    @action.bound drPlotRemoveHover() {
        this.drModelHover = null;
    }
    // end dose-response plotting data methods

    // start model selection methods
    @action.bound saveSelectedModelIndex(idx) {
        this.selectedOutput.selected_model_index = idx;

        if (idx > -1) {
            let model = this.selectedOutput.models[idx];
            this.drModelSelected = getDrBmdLine(model, "#4a9f2f");
        } else {
            this.drModelSelected = null;
        }
    }
    @action.bound saveSelectedIndexNotes(value) {
        this.selectedOutput.selected_model_notes = value;
    }
    @action.bound saveSelectedModel() {
        // api call to update
        console.warn("implement!");
    }
    // end model selection methods

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
