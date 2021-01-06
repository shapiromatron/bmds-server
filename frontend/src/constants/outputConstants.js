const infoTable = {
    model_name: {label: "Model Name", value: ""},
    dataset_name: {label: "Dataset Name", value: ""},
    dose_response_model: {label: "Dose Response Model", value: ""},
};

const model_options = {
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
};

const bmrType = {
    1: "Abs. Dev",
    2: "Std. Dev",
    3: "Rel. Dev",
    4: "Point Estimate",
    5: "Hybrid-Extra Risk",
};
const distType = {
    1: "Normal",
    2: "Log-Normal",
};
const varType = {
    1: "Constant",
    2: "Non-Constant",
};

const modelData = {
    dependent_variable: {label: "Dependent Variable", value: "Dose"},
    independent_variable: {label: "Independent Variable", value: "Mean"},
    number_of_observations: {label: "Number of Observations", value: ""},
    adverse_direction: {label: "Adverse Direction", value: ""},
};

const adverse_direction = {
    0: "Automatic",
    1: "Up",
    2: "Down",
};
const layout = {
    showlegend: true,
    autosize: true,
    margin: {l: 50, r: 5, t: 50, b: 50},
    legend: {yanchor: "top", y: 0.99, xanchor: "left", x: 0.01},
    displayModeBar: false,
    xaxis: {
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
        title: {
            text: "",
            font: {
                family: "Courier New, monospace",
                size: 12,
                color: "#7f7f7f",
            },
        },
    },
    title: {
        text: "Response Plot",
        font: {
            family: "Courier New, monospace",
            size: 12,
        },
        xref: "paper",
    },
};

export {infoTable, model_options, bmrType, distType, varType, modelData, adverse_direction, layout};
