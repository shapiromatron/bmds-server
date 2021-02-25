import {observable, action, computed, toJS} from "mobx";
import _ from "lodash";
import {getHeaders} from "../common";

import {getDrLayout, getDrDatasetPlotData, getDrBmdLine} from "../constants/plotting";
import {Dtype} from "../constants/dataConstants";

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

    @observable showBMDLine = false;

    @action setSelectedOutputIndex(output_id) {
        this.selectedOutputIndex = output_id;
    }

    @computed get canEdit() {
        return this.rootStore.mainStore.canEdit;
    }

    @computed get outputs() {
        return this.rootStore.mainStore.getExecutionOutputs;
    }
    @computed get selectedOutput() {
        const outputs = this.outputs;
        if (!_.isObject(outputs)) {
            return null;
        }
        return outputs[this.selectedOutputIndex];
    }
    @computed get selectedDataset() {
        const dataset_index = this.selectedOutput.metadata.dataset_index;
        return this.rootStore.dataStore.datasets[dataset_index];
    }

    @computed get recommendationEnabled() {
        return this.selectedOutput.recommender.settings.enabled;
    }

    @computed get getPValue() {
        let percentileValue = _.range(0.01, 1, 0.01);
        let pValue = percentileValue.map(function(each_element) {
            return Number(each_element.toFixed(2));
        });
        return pValue;
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

    @computed get drModelSelected() {
        const output = this.selectedOutput;
        if (output && _.isNumber(output.selected.model_index)) {
            const model = output.models[output.selected.model_index];
            return getDrBmdLine(model, "#4a9f2f");
        }
        return null;
    }

    // start modal methods
    @action.bound showModalDetail(model) {
        this.modalModel = model;
        if (!this.drModelSelected || this.drModelSelected.name !== model.name) {
            this.drModelModal = getDrBmdLine(model, "#0000FF");
        }
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
        return getDrLayout(
            this.selectedDataset,
            this.drModelSelected,
            this.drModelModal,
            this.drModelHover
        );
    }
    @computed get drPlotData() {
        const data = [getDrDatasetPlotData(this.selectedDataset)];
        if (this.drModelSelected) {
            data.push(this.drModelSelected);
        }
        if (this.drModelModal) {
            data.push(this.drModelModal);
        }
        if (this.drModelHover) {
            data.push(this.drModelHover);
        }
        return data;
    }
    @computed get drPlotModalData() {
        const data = [getDrDatasetPlotData(this.selectedDataset)];
        if (this.drModelModal) {
            data.push(this.drModelModal);
        }
        if (this.drModelSelected) {
            data.push(this.drModelSelected);
        }
        return data;
    }
    @action.bound drPlotAddHover(model) {
        if (this.drModelSelected && this.drModelSelected.name === model.name) {
            return;
        }
        this.drModelHover = getDrBmdLine(model, "#DA2CDA");
    }
    @action.bound drPlotRemoveHover() {
        this.drModelHover = null;
    }
    // end dose-response plotting data methods

    // start model selection methods
    @action.bound saveSelectedModelIndex(idx) {
        this.selectedOutput.selected.model_index = idx === -1 ? null : idx;
    }
    @action.bound saveSelectedIndexNotes(value) {
        this.selectedOutput.selected.notes = value.length > 0 ? value : null;
    }
    @action.bound saveSelectedModel() {
        const output = this.selectedOutput,
            {csrfToken, editKey} = this.rootStore.mainStore.config.editSettings,
            payload = toJS({
                editKey,
                data: {
                    dataset_index: output.metadata.dataset_index,
                    option_index: output.metadata.option_index,
                    selected: {
                        model_index: output.selected.model_index,
                        notes: output.selected.notes,
                    },
                },
            }),
            url = `${this.rootStore.mainStore.config.apiUrl}select-model/`;

        fetch(url, {
            method: "POST",
            mode: "cors",
            headers: getHeaders(csrfToken),
            body: JSON.stringify(payload),
        })
            .then(response => {
                if (!response.ok) {
                    console.error(response.text());
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
    // end model selection methods

    getOutputName(idx) {
        /*
        Not @computed because it has a parameter, this is still observable; prevents caching;
        source: https://mobx.js.org/computeds-with-args.html
        */
        const output = this.outputs[idx],
            dataset = this.rootStore.dataStore.datasets[output.metadata.dataset_index];

        if (this.rootStore.optionsStore.optionsList.length > 1) {
            return `${dataset.metadata.name}: Option Set ${output.metadata.option_index + 1}`;
        } else {
            return dataset.metadata.name;
        }
    }

    @computed get dichotomousdeviance() {
        let deviances = this.modalModel.results.deviance;
        let data = [];
        deviances.names.map((deviance, index) => {
            data.push([
                deviance,
                deviances.ll[index],
                deviances.params[index],
                deviances.deviance[index],
                deviances.df[index],
                deviances.p_value[index],
            ]);
        });
        return data;
    }

    @computed get continuousDeviance() {
        let deviances = this.modalModel.results.deviance;
        let data = [];
        deviances.names.map((deviance, i) => {
            data.push([
                deviance,
                deviances.loglikelihoods[i],
                deviances.num_params[i],
                deviances.aics[i],
            ]);
        });
        return data;
    }

    @computed get modelParameters() {
        let parameters = this.modalModel.results.parameters;
        let data = [];
        parameters.names.map((item, index) => {
            data.push([item, parameters.values[index], parameters.bounded[index].toString()]);
        });
        return data;
    }

    @computed get goodnessofFit() {
        let gofArray = [];
        let results = this.modalModel.results.gof;
        let dataset = this.selectedDataset;
        let dtype = this.selectedOutput.dataset.dtype;
        if (dtype == Dtype.CONTINUOUS) {
            results.dose.map((result, i) => {
                gofArray.push([
                    result,
                    results.est_mean[i],
                    results.calc_mean[i],
                    results.obs_mean[i],
                    results.size[i],
                    results.residual[i],
                ]);
            });
        }
        if (dtype == Dtype.DICHOTOMOUS) {
            dataset.doses.map((result, i) => {
                gofArray.push([
                    result,
                    results.expected[i] / dataset.ns[i],
                    results.expected[i],
                    dataset.incidences[i],
                    dataset.ns[i],
                    results.residual[i],
                ]);
            });
        }

        return gofArray;
    }

    @computed get testInterest() {
        let gofArray = [];
        let tests = this.modalModel.results.tests;
        tests.names.map((name, i) => {
            gofArray.push([name, tests.ll_ratios[i], tests.dfs[i], tests.p_values[i]]);
        });
        return gofArray;
    }
}

export default OutputStore;
