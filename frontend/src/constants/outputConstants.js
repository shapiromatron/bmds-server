const generateLine = {
    Exponential: (doses, param) => {
        return doses.map(dose => {
            return (
                param.g +
                (param.v * Math.pow(dose, param.n)) /
                    (Math.pow(param.k, param.n) + Math.pow(dose, param.n))
            );
        });
    },
    Hill: (doses, param) => {
        return doses.map(dose => {
            return (
                param.g +
                (param.v * Math.pow(dose, param.n)) /
                    (Math.pow(param.k, param.n) + Math.pow(dose, param.n))
            );
        });
    },
    Linear: (doses, param) => {
        return doses.map(dose => {
            return param.g + param.b1 * dose;
        });
    },
    Polynomial: (doses, param) => {
        return doses.map(dose => {
            return (
                param.g +
                (param.v * Math.pow(dose, param.n)) /
                    (Math.pow(param.k, param.n) + Math.pow(dose, param.n))
            );
        });
    },
    Power: (doses, param) => {
        return doses.map(dose => {
            return param.g + param.v * Math.pow(dose, param.n);
        });
    },
    "Dichotomous-Hill": (doses, param) => {
        return doses.map(dose => {
            return (
                param.g +
                (param.v - param.v * param.g) / (1 + Math.exp(-param.a - param.b * Math.log(dose)))
            );
        });
    },
    Gamma: (doses, param) => {
        return doses.map(dose => {
            return param.g + (1 - param.g);
        });
    },
    Logistic: (doses, param) => {
        return doses.map(dose => {
            return 1 / [1 + Math.exp(-param.a - param.b * dose)];
        });
    },
    "Log-Logistic": (doses, param) => {
        return doses.map(dose => {
            return param.g + (1 - param.g) / [1 + Math.exp(-param.a - param.b * Math.Log(dose))];
        });
    },
    "Log-Probit": (doses, param) => {
        return doses.map(dose => {
            return param.g + (1 - param.g) * Math.sqrt(param.a + param.b * Math.Log(dose));
        });
    },
    Multistage: (doses, param) => {
        return doses.map(dose => {
            return (
                param.g +
                (1 - param.g) * [1 - Math.exp((-param.b1 * dose) ^ (1 - param.b2 * dose) ^ 2)]
            );
        });
    },
    Probit: (doses, param) => {
        return doses.map(dose => {
            return Math.sqrt(param.a + param.b * dose);
        });
    },
    "Quantal Linear": (doses, param) => {
        return doses.map(dose => {
            return param.g + (1 - param.g) * [1 - Math.exp(-param.b * dose)];
        });
    },
    Weibull: (doses, param) => {
        return doses.map(dose => {
            return param.g + (1 - param.g) * [1 - Math.exp((-param.b * dose) ^ param.a)];
        });
    },
};

const infoTable = {
    model_name: {label: "Model Name", value: ""},
    dataset_name: {label: "Dataset Name", value: ""},
    dose_response_model: {label: "Dose Response Model", value: ""},
};

const parameters = {
    Exponential: ["a", "b", "c"],
    Hill: ["g", "v", "k", "n", "alpha"],
    Linear: ["g", "b1", "alpha"],
    Polynomial: ["a", "b", "c"],
    Power: ["g", "v", "n", "alpha"],
    "Dichotomous-Hill": ["g", "v", "a", "b"],
    Gamma: ["g", "a", "b"],
    Logistic: ["a", "b"],
    "Log-Logistic": ["g", "a", "b"],
    "Log-Probit": ["g", "a", "b"],
    Multistage: ["g", "b1", "b2"],
    Probit: ["a", "b"],
    Quantal_Linear: ["g", "b"],
    Weibull: ["g", "a", "b"],
};

const dose_response_model = {
    Exponential: "TODO",
    Hill: "M[dose] = g + v*dose^n/(k^n + dose^n)",
    Linear: "M[dose] = g + b1*dose",
    Polynomial: "TODO",
    Power: "M[dose] = g + v * dose^n",
    "Dichotomous-Hill": "P[dose] = g +(v-v*g)/[1+exp(-a-b*Log(dose))]",
    Gamma: "P[dose]= g+(1-g)*CumGamma[b*dose,a]",
    Logistic: "P[dose] = 1/[1+exp(-a-b*dose)]",
    "Log-Logistic": "P[dose] = g+(1-g)/[1+exp(-a-b*Log(dose))]",
    "Log-Probit": "P[dose] = g+(1-g) * CumNorm(a+b*Log(Dose))",
    Multistage: "P[dose] = g + (1-g)*[1-exp(-b1*dose^1-b2*dose^2 - ...)",
    Probit: "P[dose] = CumNorm(a+b*Dose)",
    Quantal_Linear: "P[dose] = g + (1-g)*[1-exp(-b*dose)]",
    Weibull: "P[dose] = g + (1-g)*[1-exp(-b*dose^a)]",
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
const benchmarkDose = {
    bmd: {label: "BMD", value: ""},
    bmdl: {label: "BMDL", value: ""},
    bmdu: {label: "BMDU", value: ""},
    aic: {label: "AIC", value: ""},
    p_value: {label: "P Value", value: ""},
    df: {label: "DOF", value: ""},
};

const goodnessFitHeaders = {
    CS: [
        "Dose",
        "Observed Mean",
        "Observed SD",
        "Calculated Median",
        "Calculated SD",
        "Estimated Median",
        "Estimated SD",
        "Size",
        "Scaled Residual",
    ],
    DM: ["Dose", "Estimated probability", "Expected", "Observed", "Size", "Scaled Residual"],
};

const scatter_plot_layout = {
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
};

const cdf_plot_layout = {
    showlegend: true,
    title: {
        text: "CDF Plot",
        font: {
            family: "Courier New, monospace",
            size: 16,
        },
        xref: "paper",
    },
    xaxis: {
        linecolor: "black",
        linewidth: 1,
        mirror: true,
        title: {
            text: "Percentile",
            font: {
                family: "Courier New, monospace",
                size: 14,
                color: "#7f7f7f",
            },
        },
    },
    yaxis: {
        linecolor: "black",
        linewidth: 1,
        mirror: true,
        title: {
            text: "CDF",
            font: {
                family: "Courier New, monospace",
                size: 14,
                color: "#7f7f7f",
            },
        },
    },
    plot_bgcolor: "",
    paper_bgcolor: "#eee",
    width: 400,
    height: 400,
    autosize: true,
};

export {
    generateLine,
    infoTable,
    parameters,
    dose_response_model,
    model_options,
    bmrType,
    distType,
    varType,
    modelData,
    adverse_direction,
    benchmarkDose,
    goodnessFitHeaders,
    scatter_plot_layout,
    cdf_plot_layout,
};
