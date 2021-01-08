import * as dc from "./dataConstants";

export const model_options = {
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
        autosize: true,
        displayModeBar: false,
        legend: {yanchor: "top", y: 0.99, xanchor: "left", x: 0.01},
        margin: {l: 50, r: 5, t: 50, b: 50},
        showlegend: true,
        title: {
            text: "ADD",
        },
        xaxis: {
            title: {
                text: "ADD",
            },
        },
        yaxis: {
            title: {
                text: "ADD",
            },
        },
    },
    getPValue = function(dataType, results) {
        if (dataType === dc.DATA_DICHOTOMOUS) {
            return results.gof.p_value;
        } else {
            return -999;
        }
    };
