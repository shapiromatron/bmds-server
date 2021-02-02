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
        litter_sizes: "Litter Size",
        litter_specific_covariates: "Litter Specific Covariate",
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
                    doses: [0, 7, 37, 186],
                    ns: [25, 25, 25, 24],
                    means: [55.8, 52.9, 64.8, 119.9],
                    stdevs: [12.5, 15.4, 17.4, 32.5],
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
        [Dtype.CONTINUOUS]: ["Enabled", "Dataset", "Adverse Direction"],
        [Dtype.CONTINUOUS_INDIVIDUAL]: ["Enabled", "Dataset", "Adverse Direction"],
        [Dtype.DICHOTOMOUS]: ["Enabled", "Dataset"],
    },
    adverseDirectionOptions = [
        {value: "automatic", name: "Automatic"},
        {value: "up", name: "Up"},
        {value: "down", name: "Down"},
    ],
    datasetColumnLength = {
        [DATA_CONTINUOUS_SUMMARY]: 4,
        [DATA_CONTINUOUS_INDIVIDUAL]: 2,
        [DATA_DICHOTOMOUS]: 3,
    },
    datasetTypes = {
        [DATA_CONTINUOUS_SUMMARY]: "Continuous Summarized",
        [DATA_CONTINUOUS_INDIVIDUAL]: "Continuous Individual",
        [DATA_DICHOTOMOUS]: "Dichotomous",
    };
