import _ from "lodash";
import {makeAutoObservable, toJS} from "mobx";

import {getHeaders} from "@/common";
import {maIndex, modelClasses} from "@/constants/outputConstants";
import {
    bmaColor,
    colorCodes,
    getBayesianBMDLine,
    getDrBmdLine,
    getDrDatasetPlotData,
    getDrLayout,
    getLollipopDataset,
    getLollipopPlotLayout,
    hoverColor,
    selectedColor,
} from "@/constants/plotting";

class OutputStore {
    /*
    An `Output` are the modeling results that are a permutation of a dataset and an option-set.
    */
    constructor(rootStore) {
        makeAutoObservable(this, {rootStore: false}, {autoBind: true});
        this.rootStore = rootStore;
    }

    showModelModal = false;
    modalModel = null;
    modalModelClass = null;
    currentOutput = {};
    selectedOutputIndex = 0;
    drModelHover = null;
    drModelModal = null;
    drModelModalIsMA = false;
    drModelAverageModal = false;
    showBMDLine = false;
    showInlineNotes = false;

    toggleInlineNotes() {
        this.showInlineNotes = !this.showInlineNotes;
    }

    setSelectedOutputIndex(output_id) {
        this.selectedOutputIndex = output_id;
        this.resetUserPlotSettings();
    }

    get getModelType() {
        return this.rootStore.mainStore.model_type;
    }

    get globalErrorMessage() {
        return this.rootStore.mainStore.errorMessage;
    }

    get hasNoResults() {
        return this.selectedOutput === null;
    }

    get hasAnyError() {
        return (
            this.globalErrorMessage || (this.selectedOutput && this.selectedOutput.error !== null)
        );
    }

    get canEdit() {
        return this.rootStore.mainStore.canEdit;
    }

    get outputs() {
        return this.rootStore.mainStore.getExecutionOutputs;
    }

    get selectedOutput() {
        const outputs = this.outputs;
        if (!_.isObject(outputs)) {
            return null;
        }
        return outputs[this.selectedOutputIndex];
    }

    get selectedFrequentist() {
        const output = this.selectedOutput;
        if (output && output.frequentist) {
            return output.frequentist;
        }
        return null;
    }

    get selectedBayesian() {
        const output = this.selectedOutput;
        if (output && output.bayesian) {
            return output.bayesian;
        }
        return null;
    }

    get selectedDataset() {
        const dataset_index = this.selectedOutput.dataset_index;
        return this.rootStore.dataStore.datasets[dataset_index];
    }

    get selectedModelOptions() {
        const index = this.selectedOutput.option_index;
        return this.rootStore.optionsStore.optionsList[index];
    }

    get selectedDatasetOptions() {
        const index = this.selectedOutput.dataset_index;
        return this.rootStore.dataOptionStore.options[index];
    }

    get recommendationEnabled() {
        return (
            this.selectedOutput.frequentist &&
            this.selectedOutput.frequentist.recommender.settings.enabled
        );
    }

    get getPValue() {
        let percentileValue = _.range(0.01, 1, 0.01);
        let pValue = percentileValue.map(function(each_element) {
            return Number(each_element.toFixed(2));
        });
        return pValue;
    }

    get doseArray() {
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

    get drModelSelected() {
        const output = this.selectedOutput;
        if (output && output.frequentist && _.isNumber(output.frequentist.selected.model_index)) {
            const model = output.frequentist.models[output.frequentist.selected.model_index];
            return getDrBmdLine(model, selectedColor);
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

    showModalDetail(modelClass, index) {
        this.modalModelClass = modelClass;
        const model = this.getModel(index);
        this.modalModel = model;
        this.drModelModalIsMA = index === maIndex;
        if (
            !this.drModelModalIsMA &&
            (!this.drModelSelected || this.drModelSelected[0].name !== model.name)
        ) {
            this.drModelModal = getDrBmdLine(model, hoverColor);
        }
        this.showModelModal = true;
    }

    closeModal() {
        this.modalModel = null;
        this.drModelModal = null;
        this.showModelModal = false;
    }

    // end modal methods

    // start dose-response plotting data methods
    get showSelectedModelInModalPlot() {
        return this.modalModelClass === modelClasses.frequentist;
    }

    get drIndividualPlotData() {
        // a single model, shown in the modal
        const data = [getDrDatasetPlotData(this.selectedDataset)];
        if (this.showSelectedModelInModalPlot && this.drModelSelected) {
            data.push(...this.drModelSelected);
        }
        if (this.drModelModal) {
            data.push(...this.drModelModal);
        }
        if (this.drModelHover) {
            data.push(...this.drModelHover);
        }
        return data;
    }

    get drIndividualPlotLayout() {
        // a single model, shown in the modal
        const selectedModel = this.showSelectedModelInModalPlot ? this.drModelSelected : null;
        return getDrLayout(
            this.selectedDataset,
            selectedModel,
            this.drModelModal,
            this.drModelHover
        );
    }

    get drFrequentistPlotData() {
        const data = [getDrDatasetPlotData(this.selectedDataset)];
        if (this.drModelSelected) {
            data.push(...this.drModelSelected);
        }
        if (this.drModelModal) {
            data.push(...this.drModelModal);
        }
        if (this.drModelHover) {
            data.push(...this.drModelHover);
        }
        return data;
    }

    get drFrequentistPlotLayout() {
        // the main frequentist plot shown on the output page
        let layout = getDrLayout(
            this.selectedDataset,
            this.drModelSelected,
            this.drModelModal,
            this.drModelHover
        );
        if (this.userPlotSettings && this.userPlotSettings.xaxis) {
            layout.xaxis.range = this.userPlotSettings.xaxis;
        }
        if (this.userPlotSettings && this.userPlotSettings.yaxis) {
            layout.yaxis.range = this.userPlotSettings.yaxis;
        }
        return layout;
    }

    get drBayesianPlotData() {
        const bayesian_plot_data = [getDrDatasetPlotData(this.selectedDataset)],
            output = this.selectedOutput;
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
            bayesian_plot_data.push(...bma_data);
        }
        return bayesian_plot_data;
    }

    get drBayesianPlotLayout() {
        // the bayesian plot shown on the output page and modal
        const layout = _.cloneDeep(this.drFrequentistPlotLayout);
        layout.legend = {tracegroupgap: 0, x: 1, y: 1};
        return layout;
    }

    get drPlotModalData() {
        const data = [getDrDatasetPlotData(this.selectedDataset)];
        if (this.drModelModal) {
            data.push(...this.drModelModal);
        }
        if (this.drModelSelected) {
            data.push(...this.drModelSelected);
        }
        return data;
    }

    drPlotAddHover(model) {
        if (this.drModelSelected && this.drModelSelected[0].name === model.name) {
            return;
        }
        this.drModelHover = getDrBmdLine(model, hoverColor);
    }

    drPlotRemoveHover() {
        this.drModelHover = null;
    }

    get drFrequentistLollipopPlotDataset() {
        let plotData = [];
        let models = this.selectedOutput.frequentist.models;
        models.map(model => {
            let dataArray = [];
            let modelArray = new Array(3);
            modelArray.fill(model.name);
            dataArray.push(model.results.bmdl);
            dataArray.push(model.results.bmd);
            dataArray.push(model.results.bmdu);
            let data = getLollipopDataset(dataArray, modelArray, model.name);
            plotData.push(data);
        });
        return plotData;
    }

    get drBayesianLollipopPlotDataset() {
        let plotData = [];
        let models = this.selectedOutput.bayesian.models;
        models.map(model => {
            let dataArray = [];
            let modelArray = new Array(3);
            modelArray.fill(model.name);
            dataArray.push(model.results.bmdl);
            dataArray.push(model.results.bmd);
            dataArray.push(model.results.bmdu);
            let data = getLollipopDataset(dataArray, modelArray, model.name);
            plotData.push(data);
        });
        return plotData;
    }

    get drFrequentistLollipopPlotLayout() {
        return getLollipopPlotLayout("Frequentist bmd/bmdl/bmdu Plot", this.selectedDataset);
    }

    get drBayesianLollipopPlotLayout() {
        return getLollipopPlotLayout("Bayesian bmd/bmdl/bmdu Plot", this.selectedDataset);
    }
    // end dose-response plotting data methods

    // start model selection methods
    saveSelectedModelIndex(idx) {
        this.selectedOutput.frequentist.selected.model_index = idx === -1 ? null : idx;
    }

    saveSelectedIndexNotes(value) {
        this.selectedOutput.frequentist.selected.notes = value.length > 0 ? value : null;
    }

    saveSelectedModel() {
        const output = this.selectedOutput,
            {csrfToken, editKey} = this.rootStore.mainStore.config.editSettings,
            payload = toJS({
                editKey,
                data: {
                    dataset_index: output.dataset_index,
                    option_index: output.option_index,
                    selected: {
                        model_index: output.frequentist.selected.model_index,
                        notes: output.frequentist.selected.notes || "",
                    },
                },
            }),
            url = `${this.rootStore.mainStore.config.apiUrl}select-model/`;

        this.rootStore.mainStore.hideToast();
        fetch(url, {
            method: "POST",
            mode: "cors",
            headers: getHeaders(csrfToken),
            body: JSON.stringify(payload),
        })
            .then(response => {
                if (!response.ok) {
                    console.error(response.text());
                } else {
                    this.rootStore.mainStore.showToast(
                        "Updated model selection",
                        "Model selection updated."
                    );
                    setTimeout(this.rootStore.mainStore.hideToast, 3000);
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
            dataset = this.rootStore.dataStore.datasets[output.dataset_index];

        if (this.rootStore.optionsStore.optionsList.length > 1) {
            return `${dataset.metadata.name}: Option Set ${output.option_index + 1}`;
        } else {
            return dataset.metadata.name;
        }
    }

    // persist changes to axes by user for a given output session
    userPlotSettings = {};
    resetUserPlotSettings(output_id) {
        this.userPlotSettings = {};
    }
    updateUserPlotSettings(e) {
        // set user configurable plot settings
        if (_.has(e, "xaxis.range[0]") && _.has(e, "xaxis.range[1]")) {
            this.userPlotSettings["xaxis"] = [e["xaxis.range[0]"], e["xaxis.range[1]"]];
        }
        if (_.has(e, "yaxis.range[0]") && _.has(e, "yaxis.range[1]")) {
            this.userPlotSettings["yaxis"] = [e["yaxis.range[0]"], e["yaxis.range[1]"]];
        }
        if (_.has(e, "yaxis.autorange")) {
            this.userPlotSettings["yaxis"] = undefined;
        }
        if (_.has(e, "xaxis.autorange")) {
            this.userPlotSettings["xaxis"] = undefined;
        }
    }
}

export default OutputStore;
