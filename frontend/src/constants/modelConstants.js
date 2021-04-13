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
            frequentist_unrestricted: ["Logistic", "LogProbit", "Probit", "Quantal Linear"],
        },
    };

export {modelsList, models};
