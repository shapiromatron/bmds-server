import * as mc from "./mainConstants";

const Dtype = {
    DICHOTOMOUS: "D",
    CONTINUOUS: "C",
    CONTINUOUS_INDIVIDUAL: "CI",
};

export {Dtype};
export const DATA_CONTINUOUS_SUMMARY = "CS",
    DATA_CONTINUOUS_INDIVIDUAL = "I",
    DATA_DICHOTOMOUS = "DM",
    datasetTypesByModelType = function(modelType) {
        switch (modelType) {
            case mc.MODEL_DICHOTOMOUS:
                return [{value: DATA_DICHOTOMOUS, name: "Dichotomous"}];
            case mc.MODEL_CONTINUOUS:
                return [
                    {value: DATA_CONTINUOUS_SUMMARY, name: "Summarized"},
                    {value: DATA_CONTINUOUS_INDIVIDUAL, name: "Individual"},
                ];
            default:
                throw `Unknown modelType: ${modelType}`;
        }
    },
    columns = {
        [Dtype.CONTINUOUS]: ["doses", "ns", "means", "stdevs"],
        [Dtype.CONTINUOUS_INDIVIDUAL]: ["doses", "responses"],
        [Dtype.DICHOTOMOUS]: ["doses", "ns", "incidences"],
    },
    columnNames = {
        [DATA_CONTINUOUS_SUMMARY]: {
            doses: "Dose",
            ns: "N",
            means: "Mean",
            stdevs: "Std. Dev.",
        },
        [DATA_CONTINUOUS_INDIVIDUAL]: {
            doses: "Dose",
            responses: "Response",
        },
        [DATA_DICHOTOMOUS]: {
            doses: "Dose",
            ns: "N",
            incidences: "Incidence",
        },
    },
    columnHeaders = {
        doses: "Dose",
        ns: "N",
        means: "Mean",
        stdevs: "Std. Dev.",
        responses: "Response",
        incidences: "Incidence",
    },
    getDefaultDataset = function(dtype) {
        switch (dtype) {
            case DATA_CONTINUOUS_SUMMARY:
                return {
                    dtype: Dtype.CONTINUOUS,
                    metadata: {
                        id: null,
                        name: "",
                        dose_units: "",
                        response_units: "",
                        dose_name: "Dose",
                        response_name: "Response",
                    },
                    doses: [0, 50, 100, 150, 200],
                    ns: [100, 100, 100, 100, 100],
                    means: [10, 18, 32, 38, 70],
                    stdevs: [3.2, 4.8, 6.5, 7.2, 8.4],
                };
            case DATA_CONTINUOUS_INDIVIDUAL:
                return {
                    dtype: Dtype.CONTINUOUS_INDIVIDUAL,
                    metadata: {
                        id: null,
                        name: "",
                        dose_units: "",
                        response_units: "",
                        dose_name: "Dose",
                        response_name: "Response",
                    },
                    doses: [0, 0, 0, 0, 5, 5, 5, 5],
                    responses: [1, 1, 2, 3, 4, 5, 6, 7],
                };
            case DATA_DICHOTOMOUS:
                return {
                    dtype: Dtype.DICHOTOMOUS,
                    metadata: {
                        id: null,
                        name: "",
                        dose_units: "",
                        response_units: "",
                        dose_name: "Dose",
                        response_name: "Response",
                    },
                    doses: [0, 0.46, 1.39, 4.17, 12.5],
                    ns: [9, 9, 11, 10, 7],
                    incidences: [0, 0, 3, 2, 3],
                };
            default:
                throw `Unknown dataset type ${dtype}`;
        }
    },
    datasetOptionColumnNames = {
        [Dtype.CONTINUOUS]: ["Enabled", "Dataset", "Degree", "Adverse Direction"],
        [Dtype.CONTINUOUS_INDIVIDUAL]: ["Enabled", "Dataset", "Degree", "Adverse Direction"],
        [Dtype.DICHOTOMOUS]: ["Enabled", "Dataset", "Degree"],
    },
    adverseDirectionOptions = [
        {value: -1, name: "Automatic"},
        {value: 1, name: "Up"},
        {value: 0, name: "Down"},
    ],
    degreeOptions = [
        {value: 0, name: "N-1"},
        {value: 1, name: "1"},
        {value: 2, name: "2"},
        {value: 3, name: "3"},
        {value: 4, name: "4"},
        {value: 5, name: "5"},
        {value: 6, name: "6"},
        {value: 7, name: "7"},
        {value: 8, name: "8"},
    ];
