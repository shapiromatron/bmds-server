import {observable, action, computed, toJS} from "mobx";
import _ from "lodash";
import {getHeaders} from "../common";

import {modelClasses, maIndex} from "../constants/outputConstants";
import {
    getDrLayout,
    getDrDatasetPlotData,
    getDrBmdLine,
    colorCodes,
    bmaColor,
    getBayesianBMDLine,
} from "../constants/plotting";

class OutputStore {
    /*
    An `Output` are the modeling results that are a permutation of a dataset and an option-set.
    */
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable showModelModal = false;
    @observable modalModel = null;
    @observable modalModelClass = null;
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

    @computed get globalErrorMessage() {
        return this.rootStore.mainStore.errorMessage;
    }

    @computed get selectedOutputErrorMessage() {
        if (this.globalErrorMessage) {
            return this.globalErrorMessage;
        } else if (this.selectedOutput === null) {
            return "No results available.";
        } else if ("error" in this.selectedOutput) {
            return this.selectedOutput.error;
        } else {
            return null;
        }
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
    getModel(index) {
        if (this.modalModelClass === modelClasses.frequentist) {
            return this.selectedFrequentist.models[index];
        } else if (this.modalModelClass === modelClasses.bayesian) {
            if (index === maIndex) {
                return this.selectedBayesian.model_average;
            }
            return this.selectedBayesian.models[index];
        } else {
            throw `Unknown modelClass: ${this.modalModelClass}`;
        }
    }

    @action.bound showModalDetail(modelClass, index) {
        this.modalModelClass = modelClass;
        const model = this.getModel(index);
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
    @computed get showSelectedModelInModalPlot() {
        return this.modalModelClass === modelClasses.frequentist;
    }
    @computed get drIndividualPlotData() {
        // a single model, shown in the modal
        const data = [getDrDatasetPlotData(this.selectedDataset)];
        if (this.showSelectedModelInModalPlot && this.drModelSelected) {
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
    @computed get drIndividualPlotLayout() {
        // a single model, shown in the modal
        const selectedModel = this.showSelectedModelInModalPlot ? this.drModelSelected : null;
        return getDrLayout(
            this.selectedDataset,
            selectedModel,
            this.drModelModal,
            this.drModelHover
        );
    }
    @computed get drFrequentistPlotData() {
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
    @computed get drFrequentistPlotLayout() {
        // the main frequentist plot shown on the output page
        return getDrLayout(
            this.selectedDataset,
            this.drModelSelected,
            this.drModelModal,
            this.drModelHover
        );
    }
    @computed get drBayesianPlotData() {
        const bayesian_plot_data = [getDrDatasetPlotData(this.selectedDataset)];
        const output = this.selectedOutput;
        output.bayesian.models.map((model, index) => {
            let bayesian_model = {
                x: model.results.plotting.dr_x,
                y: model.results.plotting.dr_y,
                name: model.name,
                line: {
                    width: 2,
                    color: colorCodes[index],
                },
            };
            bayesian_plot_data.push(bayesian_model);
        });
        if (output.bayesian.model_average) {
            let bma_data = getBayesianBMDLine(output.bayesian.model_average, bmaColor);
            bayesian_plot_data.push(bma_data);
        }
        return bayesian_plot_data;
    }
    @computed get drBayesianPlotLayout() {
        // the bayesian plot shown on the output page and modal
        let layout = _.cloneDeep(this.drFrequentistPlotLayout);
        const output = this.selectedOutput;
        layout.annotations = getBayesianBMDLine(
            output.bayesian.model_average,
            bmaColor
        ).annotations;
        return layout;
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
