import {
    MODEL_CONTINUOUS,
    MODEL_DICHOTOMOUS,
    MODEL_MULTI_TUMOR,
    MODEL_NESTED_DICHOTOMOUS,
} from "./mainConstants";

const modelsList = {
        [MODEL_CONTINUOUS]: [
            "Exponential",
            "Exponential 2",
            "Exponential 3",
            "Exponential 4",
            "Exponential 5",
            "Hill",
            "Linear",
            "Polynomial",
            "Polynomial (Reduced)",
            "Power",
        ],
        [MODEL_DICHOTOMOUS]: [
            "Dichotomous-Hill",
            "Michaelis-Menten",
            "Gamma",
            "Logistic",
            "LogLogistic",
            "LogLogistic (Reduced)",
            "LogProbit",
            "Multistage",
            "Multistage (Reduced)",
            "Probit",
            "Quantal Linear",
            "Weibull",
        ],
        [MODEL_NESTED_DICHOTOMOUS]: ["NestedLogistic", "NCTR"],
    },
    models = {
        [MODEL_CONTINUOUS]: {
            frequentist_restricted: [
                "Exponential",
                "Exponential 2",
                "Exponential 3",
                "Exponential 4",
                "Exponential 5",
                "Hill",
                "Michaelis-Menten",
                "Polynomial",
                "Polynomial (Reduced)",
                "Power",
            ],
            frequentist_unrestricted: ["Linear"],
        },
        [MODEL_DICHOTOMOUS]: {
            frequentist_restricted: [
                "Dichotomous-Hill",
                "Michaelis-Menten",
                "Gamma",
                "LogLogistic",
                "LogLogistic (Reduced)",
                "Multistage",
                "Multistage (Reduced)",
                "Weibull",
            ],
            frequentist_unrestricted: ["Logistic", "LogProbit", "Probit", "Quantal Linear"],
        },
        [MODEL_NESTED_DICHOTOMOUS]: {
            frequentist_restricted: ["Nested Logistic"],
            frequentist_unrestricted: [],
        },
        [MODEL_MULTI_TUMOR]: {
            frequentist_restricted: ["Multistage"],
            frequentist_unrestricted: [],
        },
    },
    allModelOptions = {
        [MODEL_CONTINUOUS]: {
            frequentist_restricted: [
                "Exponential",
                "Exponential 2",
                "Exponential 3",
                "Exponential 4",
                "Exponential 5",
                "Hill",
                "Michaelis-Menten",
                "Polynomial",
                "Polynomial (Reduced)",
                "Power",
            ],
            frequentist_unrestricted: [
                "Hill",
                "Michaelis-Menten",
                "Linear",
                "Polynomial",
                "Polynomial (Reduced)",
                "Power",
            ],
            bayesian: modelsList.C,
        },
        [MODEL_DICHOTOMOUS]: {
            frequentist_restricted: [
                "Dichotomous-Hill",
                "Michaelis-Menten",
                "Gamma",
                "LogLogistic",
                "LogLogistic (Reduced)",
                "LogProbit",
                "Multistage",
                "Multistage (Reduced)",
                "Weibull",
            ],
            frequentist_unrestricted: modelsList.D,
            bayesian: [
                "Dichotomous-Hill",
                "Gamma",
                "Logistic",
                "LogLogistic",
                "LogProbit",
                "Multistage",
                "Probit",
                "Quantal Linear",
                "Weibull",
            ],
        },
        [MODEL_NESTED_DICHOTOMOUS]: {
            frequentist_restricted: ["Nested Logistic", "NCTR"],
            frequentist_unrestricted: ["Nested Logistic", "NCTR"],
        },

        [MODEL_MULTI_TUMOR]: {
            frequentist_restricted: ["Multistage"],
            frequentist_unrestricted: [],
        },
    },
    isLognormal = disttype => disttype == 3,
    hasDegrees = new Set([
        "Multistage",
        "Multistage (Reduced)",
        "Polynomial",
        "Polynomial (Reduced)",
    ]);

export {allModelOptions, hasDegrees, isLognormal, models, modelsList};
