const GammaCDF = function(x, a) {
        // adapted from http://www.math.ucla.edu/~tom/distributions/gamma.html
        var gcf = function(X, A) {
                // Good for X>A+1
                var A0 = 0,
                    B0 = 1,
                    A1 = 1,
                    B1 = X,
                    AOLD = 0,
                    N = 0;
                while (Math.abs((A1 - AOLD) / A1) > 0.00001) {
                    AOLD = A1;
                    N = N + 1;
                    A0 = A1 + (N - A) * A0;
                    B0 = B1 + (N - A) * B0;
                    A1 = X * A0 + N * A1;
                    B1 = X * B0 + N * B1;
                    A0 = A0 / B1;
                    B0 = B0 / B1;
                    A1 = A1 / B1;
                    B1 = 1;
                }
                var Prob = Math.exp(A * Math.log(X) - X - logGamma(A)) * A1;
                return 1 - Prob;
            },
            gser = function(X, A) {
                // Good for X<A+1
                var T9 = 1 / A,
                    G = T9,
                    I = 1;
                while (T9 > G * 0.00001) {
                    T9 = (T9 * X) / (A + I);
                    G = G + T9;
                    I = I + 1;
                }
                G = G * Math.exp(A * Math.log(X) - X - logGamma(A));
                return G;
            },
            logGamma = function(Z) {
                var S =
                        1 +
                        76.18009173 / Z -
                        86.50532033 / (Z + 1) +
                        24.01409822 / (Z + 2) -
                        1.231739516 / (Z + 3) +
                        0.00120858003 / (Z + 4) -
                        0.00000536382 / (Z + 5),
                    LG = (Z - 0.5) * Math.log(Z + 4.5) - (Z + 4.5) + Math.log(S * 2.50662827465);
                return LG;
            },
            GI;

        if (x <= 0) {
            GI = 0;
        } else if (a > 200) {
            var z = (x - a) / Math.sqrt(a);
            var y = Math.normalcdf(z);
            var b1 = 2 / Math.sqrt(a);
            var phiz = 0.39894228 * Math.exp((-z * z) / 2);
            var w = y - (b1 * (z * z - 1) * phiz) / 6; //Edgeworth1
            var b2 = 6 / a;
            var u = 3 * b2 * (z * z - 3) + b1 * b1 * (z ^ (4 - 10 * z * z + 15));
            GI = w - (phiz * z * u) / 72; //Edgeworth2
        } else if (x < a + 1) {
            GI = gser(x, a);
        } else {
            GI = gcf(x, a);
        }
        return GI;
    },
    normalcdf = function(X) {
        // cumulative density function (CDF) for the standard normal distribution
        // HASTINGS.  MAX ERROR = .000001
        var T = 1 / (1 + 0.2316419 * Math.abs(X)),
            D = 0.3989423 * Math.exp((-X * X) / 2),
            p =
                D *
                T *
                (0.3193815 + T * (-0.3565638 + T * (1.781478 + T * (-1.821256 + T * 1.330274))));
        return X > 0 ? 1 - p : p;
    },
    generateLine = {
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
                    (param.v - param.v * param.g) /
                        (1 + Math.exp(-param.a - param.b * Math.log(dose)))
                );
            });
        },
        Gamma: (doses, param) => {
            return doses.map(dose => {
                return param.g + (1 - param.g) * GammaCDF(dose * param.a, param.b);
            });
        },
        Logistic: (doses, param) => {
            return doses.map(dose => {
                return 1 / [1 + Math.exp(-param.a - param.b * dose)];
            });
        },
        LogLogistic: (doses, param) => {
            return doses.map(dose => {
                return (
                    param.g + (1 - param.g) / [1 + Math.exp(-param.a - param.b * Math.log(dose))]
                );
            });
        },
        LogProbit: (doses, param) => {
            return doses.map(dose => {
                return param.g + (1 - param.g) * normalcdf(param.a + param.b * Math.log(dose));
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
                return normalcdf(param.a + param.b * dose);
            });
        },
        "Quantal Linear": (doses, param) => {
            return doses.map(dose => {
                return param.g + (1 - param.g) * [1 - Math.exp(-param.b * dose)];
            });
        },
        Weibull: (doses, param) => {
            return doses.map(dose => {
                return (
                    param.g + (1 - param.g) * (1 - Math.exp(-1 * param.b * Math.pow(dose, param.a)))
                );
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
    LogLogistic: ["g", "a", "b"],
    LogProbit: ["g", "a", "b"],
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
    LogLogistic: "P[dose] = g+(1-g)/[1+exp(-a-b*Log(dose))]",
    LogProbit: "P[dose] = g+(1-g) * CumNorm(a+b*Log(Dose))",
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

const layout = {
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
    layout,
};
