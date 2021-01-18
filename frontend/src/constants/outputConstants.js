import {Dtype, DATA_DICHOTOMOUS} from "./dataConstants";

const model_option_c = [
        {label: "BMR Type", name: "bmrType", value: ""},
        {label: "BMRF", name: "bmr", value: ""},
        {label: "Tail Probability", name: "tailProb", value: ""},
        {label: "Confidence Level", name: "alpha", value: ""},
        {label: "Distribution Type", name: "distType", value: ""},
        {label: "Variance Type", name: "varType", value: ""},
    ],
    model_option_d = [
        {label: "Risk Type", name: "bmrType", value: ""},
        {label: "BMR", name: "bmr", value: ""},
        {label: "Confidence Level", name: "alpha", value: ""},
        {label: "Background", name: "background", value: ""},
    ];

export const model_options = {
        [Dtype.CONTINUOUS]: model_option_c,
        [Dtype.CONTINUOUS_INDIVIDUAL]: model_option_c,
        [Dtype.DICHOTOMOUS]: model_option_d,
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
    getPValue = function(dataType, results) {
        if (dataType === DATA_DICHOTOMOUS) {
            return results.gof.p_value;
        } else {
            return -999;
        }
    };
