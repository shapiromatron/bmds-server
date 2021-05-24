import {observable, action, computed, toJS} from "mobx";
import _ from "lodash";
import {getHeaders} from "../common";

import {modelClasses, maIndex} from "../constants/outputConstants";
import {getDrLayout, getDrDatasetPlotData, getDrBmdLine} from "../constants/plotting";

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
    @observable drModelModalIsMA = false;
    @observable drModelAverageModal = false;

    @observable showBMDLine = false;

    @action.bound setSelectedOutputIndex(output_id) {
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
    @computed get selectedFrequentist() {
        const output = this.selectedOutput;
        if (output && output.frequentist) {
            return output.frequentist;
        }
        return null;
    }
    @computed get selectedBayesian() {
        const output = this.selectedOutput;
        if (output && output.bayesian) {
            return output.bayesian;
        }
        return null;
    }
    @computed get selectedDataset() {
        const dataset_index = this.selectedOutput.metadata.dataset_index;
        return this.rootStore.dataStore.datasets[dataset_index];
    }

    @computed get recommendationEnabled() {
        return (
            this.selectedOutput.frequentist &&
            this.selectedOutput.frequentist.recommender.settings.enabled
        );
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
        if (output && output.frequentist && _.isNumber(output.frequentist.selected.model_index)) {
            const model = output.frequentist.models[output.frequentist.selected.model_index];
            return getDrBmdLine(model, "#4a9f2f");
        }
        return null;
    }

    // start modal methods
    getModel(modelClass, index) {
        if (modelClass === modelClasses.frequentist) {
            return this.selectedFrequentist.models[index];
        } else if (modelClass === modelClasses.bayesian) {
            if (index === maIndex) {
                return this.selectedBayesian.model_average;
            }
            return this.selectedBayesian.models[index];
        } else {
            throw `Unknown modelClass: ${modelClass}`;
        }
    }

    @action.bound showModalDetail(modelClass, index) {
        const model = this.getModel(modelClass, index);
        this.modalModel = model;
        this.drModelModalIsMA = index === maIndex;
        if (
            !this.drModelModalIsMA &&
            (!this.drModelSelected || this.drModelSelected.name !== model.name)
        ) {
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
    @computed get drBayesianPlotData() {
        const output = this.selectedOutput;
        const data = [getDrDatasetPlotData(this.selectedDataset)];
        output.bayesian.models.map(model => {
            let data2 = {
                x: model.results.plotting.dr_x,
                y: model.results.plotting.dr_y,
                name: model.name,
                line: {
                    width: 1,
                    color: "#add8e6",
                },
            };
            data.push(data2);
        });

        let bma = output.bayesian.models[0];
        let bma_data = {
            x: bma.results.plotting.dr_x,
            y: bma.results.plotting.dr_y,
            name: "BMA",
            line: {
                width: 4,
                color: "#00008b",
            },
        };
        data.push(bma_data);
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
        this.selectedOutput.frequentist.selected.model_index = idx === -1 ? null : idx;
    }
    @action.bound saveSelectedIndexNotes(value) {
        this.selectedOutput.frequentist.selected.notes = value.length > 0 ? value : null;
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
                        model_index: output.frequentist.selected.model_index,
                        notes: output.frequentist.selected.notes,
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
}

export default OutputStore;
