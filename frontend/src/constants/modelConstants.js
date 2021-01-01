const modelsList = {
    C: [
        {
            model: "Exponential",
            values: [
                {
                    name: "frequentist_restricted-Exponential",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "frequentist_unrestricted-Exponential",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "bayesian-Exponential",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "bayesian_model_average-Exponential",
                    isChecked: false,
                    isDisabled: true,
                    prior_weight: 0,
                },
            ],
        },
        {
            model: "Hill",
            values: [
                {
                    name: "frequentist_restricted-Hill",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-Hill",
                    isChecked: false,
                    isDisabled: false,
                },
                {name: "bayesian-Hill", isChecked: false, isDisabled: false},
                {
                    name: "bayesian_model_average-Hill",
                    isChecked: false,
                    isDisabled: true,
                    prior_weight: 0,
                },
            ],
        },
        {
            model: "Linear",
            values: [
                {
                    name: "frequentist_restricted-Linear",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "frequentist_unrestricted-Linear",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "bayesian-Linear",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "bayesian_model_average-Linear",
                    isChecked: false,
                    isDisabled: true,
                    prior_weight: 0,
                },
            ],
        },
        {
            model: "Polynomial",
            values: [
                {
                    name: "frequentist_restricted-Polynomial",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "frequentist_unrestricted-Polynomial",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "bayesian-Polynomial",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "bayesian_model_average-Polynomial",
                    isChecked: false,
                    isDisabled: true,
                    prior_weight: 0,
                },
            ],
        },
        {
            model: "Power",
            values: [
                {
                    name: "frequentist_restricted-Power",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-Power",

                    isChecked: false,
                    isDisabled: true,
                },
                {name: "bayesian-Power", isChecked: false, isDisabled: false},
                {
                    name: "bayesian_model_average-Power",
                    isChecked: false,
                    isDisabled: true,
                    prior_weight: 0,
                },
            ],
        },
    ],
    D: [
        {
            model: "Dichotomous Hill",
            values: [
                {
                    name: "frequentist_restricted-DichotomousHill",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-DichotomousHill",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian-DichotomousHill",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian_model_average-DichotomousHill",
                    isChecked: false,
                    isDisabled: true,
                    prior_weight: 0,
                },
            ],
        },
        {
            model: "Gamma",
            values: [
                {
                    name: "frequentist_restricted-Gamma",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-Gamma",
                    isChecked: false,
                    isDisabled: false,
                },
                {name: "bayesian-Gamma", isChecked: false, isDisabled: false},
                {
                    name: "bayesian_model_average-Gamma",
                    isChecked: false,
                    isDisabled: true,
                    prior_weight: 0,
                },
            ],
        },
        {
            model: "Logistic",
            values: [
                {
                    name: "frequentist_restricted-Logistic",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "frequentist_unrestricted-Logistic",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian-Logistic",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian_model_average-Logistic",
                    isChecked: false,
                    isDisabled: true,
                    prior_weight: 0,
                },
            ],
        },
        {
            model: "Log Logistic",
            values: [
                {
                    name: "frequentist_restricted-LogLogistic",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-LogLogistic",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian-LogLogistic",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian_model_average-LogLogistic",
                    isChecked: false,
                    isDisabled: true,
                    prior_weight: 0,
                },
            ],
        },
        {
            model: "Log Probit",
            values: [
                {
                    name: "frequentist_restricted-LogProbit",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-LogProbit",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian-LogProbit",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian_model_average-LogProbit",
                    isChecked: false,
                    isDisabled: true,
                    prior_weight: 0,
                },
            ],
        },
        {
            model: "Multistage",
            values: [
                {
                    name: "frequentist_restricted-Multistage",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "frequentist_unrestricted-Multistage",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "bayesian-Multistage",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "bayesian_model_average-Multistage",
                    isChecked: false,
                    isDisabled: true,
                    prior_weight: 0,
                },
            ],
        },
        {
            model: "Probit",
            values: [
                {
                    name: "frequentist_restricted-Probit",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "frequentist_unrestricted-Probit",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian-Probit",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian_model_average-Probit",
                    isChecked: false,
                    isDisabled: true,
                    prior_weight: 0,
                },
            ],
        },
        {
            model: "Quantal Linear",
            values: [
                {
                    name: "frequentist_restricted-Quantal Linear",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "frequentist_unrestricted-Quantal Linear",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian-Quantal Linear",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian_model_average-Quantal Linear",
                    isChecked: false,
                    isDisabled: true,
                    prior_weight: 0,
                },
            ],
        },
        {
            model: "Weibull",
            values: [
                {
                    name: "frequentist_restricted-Weibull",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-Weibull",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian-Weibull",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "bayesian_model_average-Weibull",
                    isChecked: false,
                    isDisabled: true,
                    prior_weight: 0,
                },
            ],
        },
    ],
    N: [
        {
            model: "Nested Logistic",
            values: [
                {
                    name: "frequentist_restricted-Nested_Logistic",
                    isChecked: false,
                    isDisabled: false,
                },
                {
                    name: "frequentist_unrestricted-Nested_Logistic",
                    isChecked: false,
                    isDisabled: false,
                },
            ],
        },
        {
            model: "NCTR",
            values: [
                {
                    name: "frequentist_restricted-NCTR",
                    isChecked: false,
                    isDisabled: true,
                },
                {
                    name: "frequentist_unrestricted-NCTR",
                    isChecked: false,
                    isDisabled: true,
                },
            ],
        },
    ],
};

const modelHeaders = {
    first: {
        model: "",
        values: [
            {name: "MLE", colspan: "2"},
            {name: "Alternatives", colspan: "2"},
        ],
    },
    second: {
        model: "",
        values: [
            {name: "Frequentist Restricted", colspan: "1"},
            {name: "Frequentist Unrestricted", colspan: "1"},
            {name: "Bayesian", colspan: "1"},
            {name: "Bayesian Model Average", colspan: "1"},
        ],
    },
    third: {
        model: "Model Name",
        values: [
            {
                name: "Enable",
                model_name: "frequentist_restricted",
                colspan: "1",
                isChecked: false,
            },
            {
                name: "Enable",
                model_name: "frequentist_unrestricted",
                colspan: "1",
                isChecked: false,
            },
            {
                name: "Enable",
                model_name: "bayesian",
                colspan: "1",
                isChecked: false,
            },
            {
                name: "Enable",
                model_name: "bayesian_model_average",
                colspan: "1",
                isChecked: false,
                prior_weight: "Prior Weight (%)",
            },
        ],
    },
};

const nestedHeaders = {
    first: {
        model: "",
        values: [{name: "MLE", colspan: "2"}],
    },
    second: {
        model: "",
        values: [
            {name: "Frequentist Restricted", colspan: "1"},
            {name: "Frequentist Unrestricted", colspan: "1"},
        ],
    },
    third: {
        model: "Model Name",
        values: [
            {
                name: "Enable",
                model_name: "frequentist_restricted",
                colspan: "1",
                isChecked: false,
            },
            {
                name: "Enable",
                model_name: "frequentist_unrestricted",
                colspan: "1",
                isChecked: false,
            },
        ],
    },
};

const model = {
    Bayesian_Model_Average: "bayesian_model_average",
    Dichotomous_Hill: "Dichotomous-Hill",
    DichotomousHill: "DichotomousHill",
};

export {modelsList, modelHeaders, nestedHeaders, model};
