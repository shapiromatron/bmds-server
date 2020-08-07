export const options = {
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

export const optionsLabel = {
    C: [
        "Option Set",
        "BMR Type",
        "BMRF",
        "Tail Probability",
        "Confidence Level",
        "Distribution",
        "Variance",
        "Polynomial Restriction",
        "Background",
    ],
    D: ["Option Set", "Risk Type", "BMR", "Confidence Level", "Background"],
    DM: ["Option Set", "Risk Type", "BMR", "Confidence Level"],
    N: [
        "Option Set",
        "Risk Type",
        "BMR",
        "Confidence Level",
        "Litter Specific Covariate",
        "Background",
        "Bootstrap Iterations",
        "Bootstrap Seed",
    ],
};
