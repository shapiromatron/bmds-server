import {
    MODEL_CONTINUOUS,
    MODEL_DICHOTOMOUS,
    MODEL_MULTI_TUMOR,
    MODEL_NESTED_DICHOTOMOUS,
} from "./mainConstants";

const modelsList = {
        [MODEL_CONTINUOUS]: [
            "Exponential",
            "Exponential2",
            "Exponential3",
            "Exponential4",
            "Exponential5",
            "Hill",
            "Linear",
            "Polynomial",
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
                "Exponential2",
                "Exponential3",
                "Exponential4",
                "Exponential5",
                "Hill",
                "Michaelis-Menten",
                "Polynomial",
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
                "Exponential2",
                "Exponential3",
                "Exponential4",
                "Exponential5",
                "Hill",
                "Michaelis-Menten",
                "Polynomial",
                "Power",
            ],
            frequentist_unrestricted: ["Hill", "Michaelis-Menten", "Linear", "Polynomial", "Power"],
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
                "Weibull",
            ],
            frequentist_unrestricted: modelsList.D,
            bayesian: modelsList.D,
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
    hasDegrees = new Set(["Multistage", "Polynomial"]);

export {allModelOptions, hasDegrees, isLognormal, models, modelsList};
