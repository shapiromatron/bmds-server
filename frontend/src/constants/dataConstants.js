import _ from "lodash";
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
                    doses: ["", "", "", "", ""],
                    ns: ["", "", "", "", ""],
                    means: ["", "", "", "", ""],
                    stdevs: ["", "", "", "", ""],
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
                    doses: ["", "", "", "", ""],
                    responses: ["", "", "", "", ""],
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
                        response_name: "Incidence",
                    },
                    doses: ["", "", "", "", ""],
                    ns: ["", "", "", "", ""],
                    incidences: ["", "", "", "", ""],
                };
            default:
                throw `Unknown dataset type ${dtype}`;
        }
    },
    getExampleData = function(dtype) {
        switch (dtype) {
            case DATA_CONTINUOUS_SUMMARY:
                return {
                    doses: [0, 50, 100, 150, 200],
                    ns: [100, 100, 100, 100, 100],
                    means: [10, 18, 32, 38, 70],
                    stdevs: [3.2, 4.8, 6.5, 7.2, 8.4],
                };
            case DATA_CONTINUOUS_INDIVIDUAL:
                /* eslint-disable */
                return {
                    doses: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1,
                        1, 1, 1, 1, 1, 1, 10, 10, 10, 10, 10, 10, 100, 100, 100, 100, 100, 100,
                        300, 300, 300, 300, 300, 300, 500, 500, 500, 500, 500, 500
                    ],
                    responses: [
                        8.1079, 9.3063, 9.7431, 9.7814, 10.0517, 10.6132, 10.7509, 11.0567,
                        9.1556, 9.6821, 9.8256, 10.2095, 10.2222, 12.0382, 9.5661, 9.7059,
                        9.9905, 10.2716, 10.471, 11.0602, 8.8514, 10.0107, 10.0854, 10.5683,
                        11.1394, 11.4875, 9.5427, 9.7211, 9.8267, 10.0231, 10.1833, 10.8685,
                        11.368, 13.5176, 12.3168, 14.002, 17.1186, 13.6368, 19.9572, 20.1347,
                        16.7743, 20.0571, 15.1564, 15.0368
                    ],
                };
                /* eslint-enable */
            case DATA_DICHOTOMOUS:
                return {
                    doses: [0, 10, 50, 150, 400],
                    ns: [20, 20, 20, 20, 20],
                    incidences: [0, 0, 1, 4, 11],
                };
            default:
                throw `Unknown dataset type ${dtype}`;
        }
    },
    adverseDirectionOptions = [
        {value: -1, label: "Automatic"},
        {value: 1, label: "Up"},
        {value: 0, label: "Down"},
    ],
    allDegreeOptions = [
        {value: 0, label: "N-1"},
        {value: 1, label: "1"},
        {value: 2, label: "2"},
        {value: 3, label: "3"},
        {value: 4, label: "4"},
        {value: 5, label: "5"},
        {value: 6, label: "6"},
        {value: 7, label: "7"},
        {value: 8, label: "8"},
    ],
    getDegreeOptions = function(dataset) {
        const maxDegree = Math.max(Math.min(4, _.uniq(dataset.doses).length - 1), 1);
        return allDegreeOptions.filter(d => d.value <= maxDegree);
    };
