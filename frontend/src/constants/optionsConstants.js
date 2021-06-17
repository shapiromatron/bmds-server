export const options = {
        C: {
            bmr_type: 2,
            bmr_value: 1,
            tail_probability: 0.01,
            confidence_level: 0.95,
            dist_type: 1,
        },
        D: {
            bmr_type: 1,
            bmr_value: 0.1,
            confidence_level: 0.95,
        },
    },
    dichotomousBmrOptions = [
        {value: 1, label: "Extra Risk"},
        {value: 2, label: "Added Risk"},
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
        {value: 3, label: "Log-normal"}, // TODO - add back
    ],
    DistTypeLognormal = 3;
