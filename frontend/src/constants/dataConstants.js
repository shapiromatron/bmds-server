import * as mc from "./mainConstants";

export const DATA_CONTINUOUS_SUMMARY = "CS",
    DATA_CONTINUOUS_INDIVIDUAL = "I",
    DATA_DICHOTOMOUS = "DM",
    DATA_NESTED = "N",
    datasetTypesByModelType = function(modelType) {
        switch (modelType) {
            case mc.MODEL_DICHOTOMOUS:
            case mc.MODEL_MULTI_TUMOR:
                return [{value: DATA_DICHOTOMOUS, name: "Dichotomous"}];
            case mc.MODEL_CONTINUOUS:
                return [
                    {value: DATA_CONTINUOUS_SUMMARY, name: "Summarized"},
                    {value: DATA_CONTINUOUS_INDIVIDUAL, name: "Individual"},
                ];
            case mc.MODEL_NESTED:
                return [{value: DATA_NESTED, name: "Nested"}];
            default:
                throw `Unknown modelType: ${modelType}`;
        }
    },
    columns = {
        [DATA_CONTINUOUS_SUMMARY]: ["doses", "ns", "means", "stdevs"],
        [DATA_CONTINUOUS_INDIVIDUAL]: ["doses", "responses"],
        [DATA_DICHOTOMOUS]: ["doses", "ns", "incidences"],
        [DATA_NESTED]: ["doses", "litter_sizes", "incidences", "litter_specific_covariates"],
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
        [DATA_NESTED]: {
            doses: "Dose",
            litter_sizes: "Litter Size",
            incidences: "Incidence",
            litter_specific_covariates: "Litter Specific Covariate",
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
    datasetForm = {
        [DATA_CONTINUOUS_SUMMARY]: {
            doses: [0, 7, 37, 186],
            ns: [25, 25, 25, 24],
            means: [55.8, 52.9, 64.8, 119.9],
            stdevs: [12.5, 15.4, 17.4, 32.5],
            adverse_direction: "automatic",
        },
        [DATA_CONTINUOUS_INDIVIDUAL]: {
            doses: ["", "", "", "", ""],
            responses: ["", "", "", "", ""],
        },
        [DATA_DICHOTOMOUS]: {
            doses: [0, 0.46, 1.39, 4.17, 12.5],
            ns: [9, 9, 11, 10, 7],
            incidences: [0, 0, 3, 2, 3],
        },
        [DATA_NESTED]: {
            doses: ["", "", "", "", ""],
            litter_sizes: ["", "", "", "", ""],
            incidences: ["", "", "", "", ""],
            litter_specific_covariates: ["", "", "", "", ""],
        },
    },
    AdverseDirectionList = [
        {value: "automatic", name: "Automatic"},
        {value: "up", name: "Up"},
        {value: "down", name: "Down"},
    ],
    degree = [
        {value: "auto-select", name: "auto-select"},
        {value: "1", name: "1"},
        {value: "2", name: "2"},
        {value: "3", name: "3"},
    ],
    background = [
        {value: "Estimated", name: "Esimated"},
        {value: "0", name: "Zero"},
    ],
    scatter_plot_layout = {
        showlegend: true,
        title: {
            text: "Scatter Plot",
            font: {
                family: "Courier New, monospace",
                size: 12,
            },
            xref: "paper",
        },
        xaxis: {
            linecolor: "black",
            linewidth: 1,
            mirror: true,
            title: {
                text: "",
                font: {
                    family: "Courier New, monospace",
                    size: 12,
                    color: "#7f7f7f",
                },
            },
        },
        yaxis: {
            linecolor: "black",
            linewidth: 1,
            mirror: true,
            title: {
                text: "",
                font: {
                    family: "Courier New, monospace",
                    size: 12,
                    color: "#7f7f7f",
                },
            },
        },
        plot_bgcolor: "",
        paper_bgcolor: "#eee",
        width: 400,
        height: 400,
        autosize: true,
    },
    yAxisTitle = {
        [DATA_CONTINUOUS_SUMMARY]: "responses",
        [DATA_CONTINUOUS_INDIVIDUAL]: "means",
        [DATA_DICHOTOMOUS]: "incidences",
        [DATA_NESTED]: "incidences",
    };
