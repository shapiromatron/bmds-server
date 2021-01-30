export const headers = {
        C: [
            "BMR Type",
            "BMRF",
            "Tail Probability",
            "Confidence Level",
            "Distribution + Variance",
            "Background",
        ],
        D: ["Risk Type", "BMR", "Confidence Level", "Background"],
    },
    options = {
        C: {
            bmr_type: "Std. Dev.",
            bmr_value: 1,
            tail_probability: 0.01,
            confidence_level: 0.95,
            dist_type: "normal",
            background: "Estimated",
        },
        D: {
            bmr_type: "Extra",
            bmr_value: 0.1,
            confidence_level: 0.95,
            background: "Estimated",
        },
    },
    bmr_type = [
        {value: "Std. Dev.", name: "Std. Dev."},
        {value: "Rel. Dev.", name: "Re. Dev."},
        {value: "Abs. Dev.", name: "Abs. Dev."},
        {value: "Point", name: "Point"},
        {value: "Hybrid", name: "Hybrid-Extra Risk"},
    ],
    other_bmr_type = [
        {value: "Extra", name: "Extra Risk"},
        {value: "Added", name: "Added Risk"},
    ],
    distTypes = [
        {value: "normal", name: "Normal + Constant"},
        {value: "normal_ncv", name: "Normal + Non-constant"},
        // {value: "log_normal", name: "Log normal"}  // TODO - add back once not broken.
    ];
