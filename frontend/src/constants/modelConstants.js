const modelsList = {
        C: ["Exponential", "Hill", "Linear", "Polynomial", "Power"],
        D: [
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
        ND: ["NestedLogistic", "NCTR"],
    },
    models = {
        C: {
            frequentist_restricted: ["Exponential", "Hill", "Polynomial", "Power"],
            frequentist_unrestricted: ["Linear"],
        },
        D: {
            frequentist_restricted: [
                "Dichotomous-Hill",
                "Gamma",
                "LogLogistic",
                "Multistage",
                "Weibull",
            ],
            frequentist_unrestricted: ["Logistic", "LogProbit", "Probit"],
        },
        ND: {
            frequentist_restricted: ["Nested Logistic"],
            frequentist_unrestricted: [],
        },
    },
    allModelOptions = {
        C: {
            frequentist_restricted: ["Exponential", "Hill", "Polynomial", "Power"],
            frequentist_unrestricted: ["Hill", "Linear", "Polynomial", "Power"],
            bayesian: modelsList.C,
        },
        D: {
            frequentist_restricted: [
                "Dichotomous-Hill",
                "Gamma",
                "LogLogistic",
                "LogProbit",
                "Multistage",
                "Weibull",
            ],
            frequentist_unrestricted: modelsList.D,
            bayesian: modelsList.D,
        },
        ND: {
            frequentist_restricted: ["Nested Logistic", "NCTR"],
            frequentist_unrestricted: ["Nested Logistic", "NCTR"],
        },
    };

export {allModelOptions, modelsList, models};
