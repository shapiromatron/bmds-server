variables = {
    "bmr_type": "BMR Type",
    "bmr_value": "BMR Value",
    "tail_probability": "Tail Probability",
    "confidence_level": "Confidence Level",
    "distribution": "Distribution",
    "C": "Mean",
    "D": "Incidence",
}

document_header = {"C": "Continuous Results", "D": "Dichotomous Results"}
parameters = {
    "Exponential": ["a", "b", "c"],
    "Hill": ["g", "v", "k", "n", "alpha"],
    "Linear": ["g", "b1", "alpha"],
    "Polynomial": ["a", "b", "c"],
    "Power": ["g", "v", "n", "alpha"],
    "Dichotomous-Hill": ["g", "v", "a", "b"],
    "Gamma": ["g", "a", "b"],
    "Logistic": ["a", "b"],
    "Log-Logistic": ["g", "a", "b"],
    "Log-Probit": ["g", "a", "b"],
    "Multistage": ["g", "b1", "b2"],
    "Probit": ["a", "b"],
    "Quantal_Linear": ["g", "b"],
    '"Weibull"': ["g", "a", "b"],
}

bmrType = {
    1: "Abs. Dev",
    2: "Std. Dev",
    3: "Rel. Dev",
    4: "Point Estimate",
    5: "Hybrid-Extra Risk",
}
riskType = {1: "Extra Risk", 2: "Added Risk"}

gof_headers = {
    "C": [
        "Dose",
        "Size",
        "Estimated Median",
        "Cal'd Median",
        "Observed Mean",
        "Estimated SD",
        "Cal'd SD",
        "Observed SD",
        "Scaled Residual",
    ],
    "D": ["Dose", "Estimated Probability", "Expected", "Observed", "Size", "Scaled Residual"],
}
likelihood_headers = ["Model", "Log Likelihood*", "# of Parameters", "AIC"]
deviances_headers = [
    "Model",
    "Log Likelihood",
    "# of parameters",
    "Deviance",
    "Test d.f.",
    "P value",
]
test_rows_headers = ["Test", "2*Log(LikelihoodRation)", "Test df", "p-value"]
