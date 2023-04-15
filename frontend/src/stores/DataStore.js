import _ from "lodash";
import {makeAutoObservable, toJS} from "mobx";

import * as dc from "@/constants/dataConstants";
import {
    columns,
    datasetTypesByModelType,
    getDefaultDataset,
    getExampleData,
} from "@/constants/dataConstants";
import {getDrDatasetPlotData, getDrLayout} from "@/constants/plotting";

let validateTabularData = function(text, columns) {
    let data = [],
        errors = [];

    data = _.chain(text)
        .split("\n")
        .filter(line => line.length > 0)
        .map(line =>
            _.chain(line)
                .split("\t")
                .map(parseFloat)
                .filter(d => _.isFinite(d))
                .value()
        )
        .compact()
        .value();

    if (
        data.length > 0 &&
        _.chain(data)
            .map(d => d.length)
            .uniq()
            .value().length !== 1
    ) {
        errors.push("Data are not of equal length or contain non-numeric values.");
    }

    data = _.zip(...data);

    if (data.length !== columns.length) {
        errors.push(`Expecting ${columns.length} columns; got ${data.length} columns`);
    }

    if (data[0].length < 3) {
        errors.push(`Expecting 3+ rows; got ${data[0].length} rows`);
    }

    if (errors.length == 0) {
        data = _.zipObject(columns, data);
    }

    return {data, errors};
};

class DataStore {
    constructor(rootStore) {
        makeAutoObservable(this, {rootStore: false}, {autoBind: true});
        this.rootStore = rootStore;
    }

    model_type = dc.DATA_CONTINUOUS_SUMMARY;
    datasets = [];
    selectedDatasetId = null;

    setDefaultsByDatasetType() {
        this.selectedDatasetId = null;
        this.datasets = [];
        this.model_type = this.getFilteredDatasetTypes[0].value;
    }

    setModelType(model_type) {
        this.model_type = model_type;
    }

    setSelectedDataset(id) {
        this.selectedDatasetId = id;
    }

    setDatasetMetadata(key, value) {
        this.selectedDataset.metadata[key] = value;
        this.rootStore.mainStore.setInputsChangedFlag();
    }

    addDataset() {
        const dataset = getDefaultDataset(this.model_type),
            id =
                _.chain(this.datasets)
                    .map(d => d.metadata.id)
                    .max()
                    .defaultTo(-1)
                    .value() + 1;

        dataset.metadata.id = id;
        dataset.metadata.name = `Dataset #${id + 1}`;
        this.datasets.push(dataset);
        this.rootStore.dataOptionStore.createOption(dataset);
        this.selectedDatasetId = id;
        this.updateOptionDegree(dataset);
    }

    updateOptionDegree() {
        // whenever the number of doses change, change the default degree
        this.rootStore.dataOptionStore.updateDefaultDegree(this.selectedDataset);
        this.rootStore.mainStore.setInputsChangedFlag();
    }

    loadExampleData() {
        const dataset = getExampleData(this.model_type),
            currentDataset = this.datasets[this.selectedDatasetId];
        _.extend(currentDataset, dataset);
        this.updateOptionDegree(dataset);
    }

    cleanRows() {
        // removes empty rows from each dataset
        this.datasets.map(dataset => {
            // get keys of row properties, and zip values into row arrays
            let keys = Object.keys(dataset).filter(key => Array.isArray(dataset[key])),
                rows = _.zip(...keys.map(key => dataset[key]));
            // splice out indices where all row properties are blank
            _.forEachRight(rows, (row, index) => {
                let isEmpty = _.every(row, e => e == "");
                if (isEmpty) {
                    keys.forEach(key => dataset[key].splice(index, 1));
                }
            });
        });
    }

    addRow() {
        const dataset = this.selectedDataset;
        Object.keys(dataset).map((key, i) => {
            if (Array.isArray(dataset[key])) {
                dataset[key].push("");
            }
        });
        this.rootStore.mainStore.setInputsChangedFlag();
    }

    deleteRow = index => {
        const dataset = this.selectedDataset;
        Object.keys(dataset).map(key => {
            if (Array.isArray(dataset[key])) {
                dataset[key].splice(index, 1);
            }
        });
        this.updateOptionDegree(dataset);
        this.rootStore.mainStore.setInputsChangedFlag();
    };

    saveDatasetCellItem(key, value, rowIdx) {
        let dataset = this.selectedDataset,
            parsedValue = parseFloat(value);
        if (_.isNumber(parsedValue)) {
            dataset[key][rowIdx] = parsedValue;
        }
        this.rootStore.mainStore.setInputsChangedFlag();
    }

    changeColumnName(name, value) {
        this.selectedDataset.column_names[name] = value;
        this.rootStore.mainStore.setInputsChangedFlag();
    }

    deleteDataset() {
        var index = this.selectedDatasetIndex,
            datasetId = toJS(this.selectedDatasetId);
        if (index > -1) {
            this.datasets.splice(index, 1);
            this.rootStore.dataOptionStore.deleteOption(datasetId);
        }
        this.selectedDatasetId = null;
        if (this.datasets.length > 0) {
            this.selectedDatasetId = this.datasets[this.datasets.length - 1].metadata.id;
        }
        this.rootStore.mainStore.setInputsChangedFlag();
    }

    setDatasets(datasets) {
        this.datasets = datasets;
        this.selectedDatasetId = datasets.length > 0 ? datasets[0].metadata.id : null;
    }

    get selectedDataset() {
        return this.datasets.find(item => item.metadata.id === this.selectedDatasetId);
    }

    get selectedDatasetIndex() {
        return _.findIndex(this.datasets, item => item.metadata.id === this.selectedDatasetId);
    }

    get selectedDatasetErrors() {
        const data = this.rootStore.mainStore.errorData;
        if (!_.isArray(data)) {
            return null;
        }
        const index = this.selectedDatasetIndex,
            filtered = data.filter(error => {
                return error.loc && error.loc[0] == "datasets" && error.loc[1] == index;
            });
        return filtered;
    }

    get selectedDatasetErrorText() {
        const data = this.selectedDatasetErrors;
        return _.isArray(data) ? data.map(el => el.msg).join(", ") : "";
    }

    get getMappedArray() {
        let datasetInputForm = [],
            dataset = this.selectedDataset;
        Object.keys(dataset).map(key => {
            if (Array.isArray(dataset[key])) {
                dataset[key].map((val, i) => {
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

    get drPlotLayout() {
        return getDrLayout(this.selectedDataset);
    }

    get drPlotData() {
        const dataset = this.selectedDataset;
        return [getDrDatasetPlotData(dataset)];
    }

    get getDatasets() {
        return this.datasets;
    }

    get getDataLength() {
        return this.datasets.length;
    }

    get canEdit() {
        return this.rootStore.mainStore.canEdit;
    }

    get getExecutionOutputs() {
        return this.rootStore.mainStore.getExecutionOutputs;
    }

    get getModelTypeDatasets() {
        return this.datasets.filter(item => item.model_type.includes(this.getModelType));
    }

    get getFilteredDatasetTypes() {
        return datasetTypesByModelType(toJS(this.getModelType));
    }

    get getModelType() {
        return this.rootStore.mainStore.model_type;
    }

    get getEnabledDatasets() {
        return this.rootStore.dataOptionStore.options
            .filter(d => d.enabled === true)
            .map(d => d.dataset);
    }

    get canAddNewDataset() {
        return this.datasets.length < 6;
    }

    get hasSelectedDataset() {
        return this.selectedDatasetId !== null;
    }

    // *** TABULAR MODAL DATASET ***
    showTabularModal = false;
    tabularModalError = "";
    tabularModalText = "";
    tabularModalData = null;
    tabularModalDataValidated = false;
    toggleDatasetModal() {
        const getDefaultText = () => {
                const expectedColumns = columns[this.selectedDataset.dtype],
                    value = _.map(this.getMappedArray, row => {
                        return _.map(expectedColumns, col => row[col].toString()).join("\t");
                    }).join("\n");
                return value;
            },
            willShow = !this.showTabularModal,
            tabularModalText = willShow ? getDefaultText() : "";

        this.tabularModalDataValidated = false;
        this.tabularModalText = tabularModalText;
        this.tabularModalError = "";
        this.tabularModalData = null;
        this.showTabularModal = willShow;
    }
    changeDatasetFromModal(text) {
        text = text.trim();
        this.tabularModalDataValidated = false;
        this.tabularModalText = text;

        if (text == "") {
            return;
        }

        let expectedColumns = columns[this.selectedDataset.dtype],
            results = validateTabularData(text, expectedColumns);

        if (results.errors.length > 0) {
            this.tabularModalError = results.errors.join("\n");
            this.tabularModalData = null;
        } else {
            this.tabularModalError = "";
            this.tabularModalData = results.data;
        }

        this.tabularModalDataValidated = results.errors.length === 0;
    }
    updateDatasetFromModal() {
        if (!this.tabularModalData) {
            return;
        }

        const dataset = _.cloneDeep(this.selectedDataset),
            index = this.selectedDatasetIndex;

        _.each(this.tabularModalData, (value, key) => {
            dataset[key] = value;
        });
        this.datasets[index] = dataset;
        this.updateOptionDegree(dataset);
        this.toggleDatasetModal();
    }
    // *** END TABULAR MODAL DATASET ***
}

export default DataStore;
