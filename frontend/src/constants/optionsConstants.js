import {MODEL_CONTINUOUS, MODEL_DICHOTOMOUS, MODEL_NESTED_DICHOTOMOUS} from "./mainConstants";

export const options = {
        [MODEL_CONTINUOUS]: {
            bmr_type: 2,
            bmr_value: 1,
            tail_probability: 0.01,
            confidence_level: 0.95,
            dist_type: 1,
        },
        [MODEL_DICHOTOMOUS]: {
            bmr_type: 1,
            bmr_value: 0.1,
            confidence_level: 0.95,
        },
        [MODEL_NESTED_DICHOTOMOUS]: {
            bmr_type: 1,
            bmr_value: 0.1,
            confidence_level: 0.95,
            litter_specific_covariate: 1,
            background: 1,
            bootstrap_iterations: 1,
            bootstrap_seed: 0,
        },
    },
    dichotomousBmrOptions = [
        {value: 0, label: "Added Risk"},
        {value: 1, label: "Extra Risk"},
    ],
    continuousBmrOptions = [
        {value: 2, label: "Std. Dev."},
        {value: 3, label: "Rel. Dev."},
        {value: 1, label: "Abs. Dev"},
        {value: 4, label: "Point"},
        {value: 6, label: "Hybrid-Extra Risk"},
        {value: 7, label: "Hybrid-Added Risk"},
    ],
    distTypeOptions = [
        {value: 1, label: "Normal + Constant"},
        {value: 2, label: "Normal + Non-constant"},
        {value: 3, label: "Lognormal"},
    ],
    litterSpecificCovariateOptions = [
        {value: 0, label: "Overall Mean"},
        {value: 1, label: "Control Group Mean"},
    ],
    backgroundOptions = [
        {value: 0, label: "Zero"},
        {value: 1, label: "Estimated"},
    ];
