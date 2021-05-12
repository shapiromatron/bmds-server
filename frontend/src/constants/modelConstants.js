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
    };

export {allModelOptions, modelsList, models};
