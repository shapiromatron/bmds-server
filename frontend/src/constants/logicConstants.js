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
        notes: val => "BMD not estimated",
        name: "BMD calculated",
    },
    bmdl_missing: {
        name: "BMDL calculated",
        notes: val => "BMDL not estimated",
    },
    bmdu_missing: {
        name: "BMDU calculated",
        notes: val => "BMDU not estimated",
    },
    aic_missing: {
        name: "AIC calculated",
        notes: val => "AIC not estimated",
    },
    roi_missing: {
        name: "Residual of Interest calculated",
        notes: val => "To Do",
    },
    variance_type: {
        notes: val => `Constant variance test failed (Test 2 p-value < ${val})`,
        name: "Constant Variance",
    },
    variance_fit: {
        name: "Non-Constant Variance",
        notes: val => `Non-Constant variance test failed (Test 3 p-value < ${val})`,
    },
    gof: {
        name: "Goodness of fit p-test",
        notes: val => `Goodness of fit p-value < ${val} `,
    },
    gof_cancer: {
        name: "Goodness of fit p-test (cancer)",
        notes: val => `BGoodness of fit p-value < ${val}`,
    },
    bmd_bmdl_ratio_fail: {
        name: "Ratio of BMD/BMDL (serious)",
        notes: val => `BMD/BMDL ratio > ${val}`,
    },
    bmd_bmdl_ratio_warn: {
        name: `Ratio of BMD/BMDL (caution)`,
        notes: val => `BMD/BMDL ratio > ${val}`,
    },
    roi_large: {
        name: "Abs(Residual of interest) too large",
        notes: val => `|Residual for Dose Group Near BMD| > ${val}`,
    },
    warnings: {
        name: "BMDS model Warning",
        notes: val => "BMD output file included warning",
    },
    high_bmd: {
        name: "BMD higher than higher dose",
        notes: val => `BMD ${val}x higher than maximum dose`,
    },
    high_bmdl: {
        name: "BMDL higher than highest dose",
        notes: val => `BMDL ${val}x higher than maximum dose`,
    },

    low_bmd_warn: {
        name: "BMD lower than lowest dose (warning)",
        notes: val => `BMD ${val}x lower than lowest non-zero dose`,
    },
    low_bmdl_warn: {
        name: "BMDL lower than lowest dose (warning)",
        notes: val => `BMDL ${val}x lower than lowest non-zero dose`,
    },
    low_bmd_fail: {
        name: "BMD lower than lowest dose (serious)",
        notes: val => `BMD ${val}x lower than lowest non-zero dose`,
    },
    low_bmdl_fail: {
        name: "BMDL lower than lowest dose (serious)",
        notes: val => `BMDL ${val}x lower than lowest non-zero dose`,
    },
    control_residual_high: {
        name: "Abs(Residual at control) too large",
        notes: val => `|Residual at control| > ${val}`,
    },
    control_stdev_fit: {
        name: "Poor control dose std. dev.",
        notes: val => `Modeled control response std. dev. > |${val}| actual response std. dev`,
    },
    dof_zero: {
        name: "D.O.F equal 0",
        notes: val => "d.f=0, saturated model (Goodness of fit test cannot be calculated)",
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
