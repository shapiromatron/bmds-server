const headers = [
    "Test Description",
    "Continuous",
    "Dichotomous",
    "Nested",
    "Test Threshold",
    "Bin Placement if Test is Failed",
    "Notes to Show",
];

const decision_logic = {
    recommend_viable: "Recommend model in viable Bin",
    recommend_questionable: "Recommended model in Questionable Bin",
    sufficiently_close_bmdl:
        'BMDL range deemed "sufficiently close" to use lowest AIC instead of lowest BMDL in viable models',
};

const long_name = {
    bmd_missing: {
        // example here; you can rewrite the others like this
        notes: val => "BMD not estimated",
        name: "BMD calculated",
    },
    bmdl_missing: {
        name: "BMDL calculated",
        note1: "BMDL not estimated",
        note2: "",
    },
    bmdu_missing: {
        name: "BMDU calculated",
        note1: "BMDU not estimated",
        note2: "",
    },
    aic_missing: {
        name: "AIC calculated",
        note1: "AIC not estimated",
        note2: "",
    },
    roi_missing: {
        name: "Residual of Interest calculated",
        note1: "To Do",
        note2: "",
    },
    variance_type: {
        // example here; you can rewrite the others like this
        notes: val => `Constant variance test failed (Test 2 p-value < ${val})`,
        name: "Constant Variance",
    },
    variance_fit: {
        name: "Non-Constant Variance",
        note1: "Non-Constant variance test failed (Test 3 p-value < ",
        note2: ")",
    },
    gof: {
        name: "Goodness of fit p-test",
        note1: "Goodness of fit p-value < ",
        note2: "",
    },
    gof_cancer: {
        name: "Goodness of fit p-test (cancer)",
        note1: "BGoodness of fit p-value < ",
        note2: "",
    },
    bmd_bmdl_ratio_fail: {
        name: "Ratio of BMD/BMDL (serious)",
        note1: "BMD/BMDL ratio > ",
        note2: "",
    },
    bmd_bmdl_ratio_warn: {
        name: "Ratio of BMD/BMDL (caution)",
        note1: "BMD/BMDL ratio > ",
        note2: "",
    },
    roi_large: {
        name: "Abs(Residual of interest) too large",
        note1: "|Residual for Dose Group Near BMD| > ",
        note2: "",
    },
    warnings: {
        name: "BMDS model Warning",
        note1: "BMD output file included warning",
        note2: "",
    },
    high_bmd: {
        name: "BMD higher than higher dose",
        note1: "BMD ",
        note2: "x higher than maximum dose",
    },
    high_bmdl: {
        name: "BMDL higher than highest dose",
        note1: "BMDL ",
        note2: "x higher than maximum dose",
    },

    low_bmd_warn: {
        name: "BMD lower than lowest dose (warning)",
        note1: "BMD ",
        note2: "x lower than lowest non-zero dose",
    },
    low_bmdl_warn: {
        name: "BMDL lower than lowest dose (warning)",
        note1: "BMDL ",
        note2: "x lower than lowest non-zero dose",
    },
    low_bmd_fail: {
        name: "BMD lower than lowest dose (serious)",
        note1: "BMD ",
        note2: "x lower than lowest non-zero dose",
    },
    low_bmdl_fail: {
        name: "BMDL lower than lowest dose (serious)",
        note1: "BMDL ",
        note2: "x lower than lowest non-zero dose",
    },
    control_residual_high: {
        name: "Abs(Residual at control) too large",
        note1: "|Residual at control| > ",
        note2: "",
    },
    control_stdev_fit: {
        name: "Poor control dose std. dev.",
        note1: "Modeled control response std. dev. > |",
        note2: "| actual response std. dev",
    },
    dof_zero: {
        name: "D.O.F equal 0",
        note1: "d.f=0, saturated model (Goodness of fit test cannot be calculated)",
        note2: "",
    },
};

const disabled_properties = [
    "bmd_missing-threshold",
    "bmdl_missing-threshold",
    "bmdu_missing-threshold",
    "aic_missing-threshold",
    "variance_type-dichotomous",
    "variance_type-nested",
    "variance_fit-dichotomous",
    "variance_fit-nested",
    "gof_cancer-continuous",
    "gof_cancer-nested",
    "control_stdev_fit-dichotomous",
    "control_stdev_fit-nested",
    "warnings-continuous",
    "warnings-dichotomous",
    "warnings-nested",
    "warnings-threshold",
    "warnings-failure_bin",
    "dof_zero-threshold",
];

const BINS = Object.freeze({
        NO_CHANGE: 0,
        WARNING: 1,
        FAILURE: 2,
    }),
    RULE_NAMES = Object.freeze({
        BMD_MISSING: "bmd_missing",
        BMDL_MISSING: "bmdl_missing",
        BMDU_MISSING: "bmdu_missing",
        AIC_MISSING: "aic_missing",
        ROI_MISSING: "roi_missing",
        VARIANCE_TYPE: "variance_type",
        VARIANCE_FIT: "variance_fit",
        GOF: "gof",
        GOF_CANCER: "gof_cancer",
        BMD_BMDL_RATIO_FAIL: "bmd_bmdl_ratio_fail",
        BMD_BMDL_RATIO_WARN: "bmd_bmdl_ratio_warn",
        ROI_LARGE: "roi_large",
        WARNINGS: "warnings",
        HIGH_BMD: "high_bmd",
        HIGH_BMDL: "high_bmdl",
        LOW_BMD_WARN: "low_bmd_warn",
        LOW_BMDL_WARN: "low_bmdl_warn",
        LOW_BMD_FAIL: "low_bmd_fail",
        LOW_BMDL_FAIL: "low_bmdl_fail",
        CONTROL_RESIDUAL_HIGH: "control_residual_high",
        CONTROL_STDEV_FIT: "control_stdev_fit",
        DOF_ZERO: "dof_zero",
    });

const logic = {
    recommend_viable: true,
    recommend_questionable: false,
    sufficiently_close_bmdl: 3,
    rules: {
        [RULE_NAMES.BMD_MISSING]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: "", // "" or float
            failure_bin: BINS.FAILURE,
        },
        [RULE_NAMES.BMDL_MISSING]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: "", // "" or float
            failure_bin: BINS.FAILURE,
        },
        [RULE_NAMES.BMDU_MISSING]: {
            enabled_continuous: false,
            enabled_dichotomous: false,
            enabled_nested: false,
            threshold: "", // "" or float
            failure_bin: BINS.WARNING,
        },
        [RULE_NAMES.AIC_MISSING]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: "", // "" or float
            failure_bin: BINS.FAILURE,
        },
        [RULE_NAMES.ROI_MISSING]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: "", // "" or float
            failure_bin: BINS.FAILURE,
        },
        [RULE_NAMES.VARIANCE_TYPE]: {
            enabled_continuous: true,
            enabled_dichotomous: false,
            enabled_nested: false,
            threshold: 0.05, // "" or float
            failure_bin: BINS.WARNING,
        },
        [RULE_NAMES.VARIANCE_FIT]: {
            enabled_continuous: true,
            enabled_dichotomous: false,
            enabled_nested: false,
            threshold: 0.05, // "" or float
            failure_bin: BINS.NO_CHANGE,
        },
        [RULE_NAMES.GOF]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: 0.1, // "" or float
            failure_bin: BINS.NO_CHANGE,
        },
        [RULE_NAMES.GOF_CANCER]: {
            enabled_continuous: false,
            enabled_dichotomous: true,
            enabled_nested: false,
            threshold: 0.05, // "" or float
            failure_bin: BINS.NO_CHANGE,
        },
        [RULE_NAMES.BMD_BMDL_RATIO_FAIL]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: 20, // "" or float
            failure_bin: BINS.NO_CHANGE,
        },
        [RULE_NAMES.BMD_BMDL_RATIO_WARN]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: 3, // "" or float
            failure_bin: BINS.WARNING,
        },
        [RULE_NAMES.ROI_LARGE]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: 2, // "" or float
            failure_bin: BINS.NO_CHANGE,
        },
        [RULE_NAMES.WARNINGS]: {
            enabled_continuous: false,
            enabled_dichotomous: false,
            enabled_nested: false,
            threshold: "", // "" or float
            failure_bin: BINS.WARNING,
        },
        [RULE_NAMES.HIGH_BMD]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: 1, // "" or float
            failure_bin: BINS.WARNING,
        },
        [RULE_NAMES.HIGH_BMDL]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: 1, // "" or float
            failure_bin: BINS.WARNING,
        },
        [RULE_NAMES.LOW_BMD_WARN]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: 3, // "" or float
            failure_bin: BINS.WARNING,
        },
        [RULE_NAMES.LOW_BMDL_WARN]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: 3, // "" or float
            failure_bin: BINS.WARNING,
        },
        [RULE_NAMES.LOW_BMD_FAIL]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: 10, // "" or float
            failure_bin: BINS.NO_CHANGE,
        },
        [RULE_NAMES.LOW_BMDL_FAIL]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: 10, // "" or float
            failure_bin: BINS.NO_CHANGE,
        },
        [RULE_NAMES.CONTROL_RESIDUAL_HIGH]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: 2, // "" or float
            failure_bin: BINS.WARNING,
        },
        [RULE_NAMES.CONTROL_STDEV_FIT]: {
            enabled_continuous: true,
            enabled_dichotomous: false,
            enabled_nested: false,
            threshold: 1.5, // "" or float
            failure_bin: BINS.WARNING,
        },
        [RULE_NAMES.DOF_ZERO]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: "", // "" or float
            failure_bin: BINS.NO_CHANGE,
        },
    },
};

export {headers, logic, decision_logic, disabled_properties, long_name};
