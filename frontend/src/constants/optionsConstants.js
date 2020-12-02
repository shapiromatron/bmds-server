const headers = {
        C: [
            "BMR Type",
            "BMRF",
            "Tail Probability",
            "Confidence Level",
            "Distribution",
            "Variance",
            "Polynomial Restriction",
            "Background",
        ],
        D: ["Risk Type", "BMR", "Confidence Level", "Background"],
        DM: ["Risk Type", "BMR", "Confidence Level"],
        N: [
            "Risk Type",
            "BMR",
            "Confidence Level",
            "Litter Specific Covariate",
            "Background",
            "Bootstrap Iterations",
            "Bootstrap Seed",
        ],
    },
    options = {
        C: {
            bmr_type: "Std. Dev.",
            bmr_value: 1,
            tail_probability: 0.01,
            confidence_level: 0.95,
            distribution: "Normal",
            variance: "Constant",
            polynomial_restriction: "Use dataset adverse direction",
            background: "Estimated",
        },
        D: {
            bmr_type: "Extra",
            bmr_value: 0.1,
            confidence_level: 0.95,
            background: "Estimated",
        },
        DM: {
            bmr_type: "Extra",
            bmr_value: 0.1,
            confidence_level: 0.95,
        },
        N: {
            bmr_type: "Extra",
            bmr_value: 0.1,
            confidence_level: 0.95,
            litter_sepcific_covariate: "Overall Mean",
            background: "Estimated",
            bootstrap_iterations: 1000,
            bootstrap_speed: "Automatic",
        },
    };
const bmr_type = [
    {value: "Std. Dev.", name: "Std. Dev."},
    {value: "Rel. Dev.", name: "Re. Dev."},
    {value: "Abs. Dev.", name: "Abs. Dev."},
    {value: "Point", name: "Point"},
    {value: "Hybrid", name: "Hybrid-Extra Risk"},
];
const other_bmr_type = [
    {value: "Extra", name: "Extra Risk"},
    {value: "Added", name: "Added Risk"},
];
const litter_specific_covariate = [
    {value: "Overall_Mean", name: "Overall Mean"},
    {value: "Control_Group_Mean", name: "Control Group Mean"},
];
const distribution = [
    {value: "Normal.", name: "Normal"},
    {value: "log normal.", name: "Log normal"},
];
const variance = [
    {value: "Constant", name: "Constant"},
    {value: "Non-constant.", name: "Non-Constant"},
];
const polynomial_restriction = [
    {value: "Use dataset adverse direction", name: "Use dataset adverse direction"},
    {value: "Non-Negative", name: "Non-Negative"},
    {value: "Non-Positive", name: "Non-Positive"},
];
const bootstrap_seed = [
    {value: "Automatic", name: "Automatic"},
    {value: "User_Specified", name: "User Specified"},
];
const datasetType = {
    Nested: "N",
    Continuous: "C",
    Dichotomous: "DM",
};
export {
    headers,
    options,
    bmr_type,
    other_bmr_type,
    litter_specific_covariate,
    distribution,
    variance,
    polynomial_restriction,
    bootstrap_seed,
    datasetType,
};
