import * as dc from "./dataConstants";

export const infoTable = {
        model_name: {label: "Model Name", value: ""},
        dataset_name: {label: "Dataset Name", value: ""},
        dose_response_model: {label: "Dose Response Model", value: ""},
    },
    model_options = {
        CS: [
            {label: "BMR Type", name: "bmrType", value: ""},
            {label: "BMRF", name: "bmr", value: ""},
            {label: "Tail Probability", name: "tailProb", value: ""},
            {label: "Confidence Level", name: "alpha", value: ""},
            {label: "Distribution Type", name: "distType", value: ""},
            {label: "Variance Type", name: "varType", value: ""},
        ],
        DM: [
            {label: "Risk Type", name: "bmrType", value: ""},
            {label: "BMR", name: "bmr", value: ""},
            {label: "Confidence Level", name: "alpha", value: ""},
            {label: "Background", name: "background", value: ""},
        ],
    },
    bmrType = {
        1: "Abs. Dev",
        2: "Std. Dev",
        3: "Rel. Dev",
        4: "Point Estimate",
        5: "Hybrid-Extra Risk",
    },
    distType = {
        1: "Normal",
        2: "Log-Normal",
    },
    varType = {
        1: "Constant",
        2: "Non-Constant",
    },
    modelData = {
        dependent_variable: {label: "Dependent Variable", value: "Dose"},
        independent_variable: {label: "Independent Variable", value: "Mean"},
        number_of_observations: {label: "Number of Observations", value: ""},
        adverse_direction: {label: "Adverse Direction", value: ""},
    },
    adverse_direction = {
        0: "Automatic",
        1: "Up",
        2: "Down",
    },
    layout = {
        showlegend: true,
        title: {
            text: "Response Plot",
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
                text: "Dose (mg/kg-day)",
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
                text: "Response (mg/dL)",
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
    getPValue = function(dataType, results) {
        if (dataType === dc.DATA_DICHOTOMOUS) {
            return results.gof.p_value;
        } else {
            return -999;
        }
    };
