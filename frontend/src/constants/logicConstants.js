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

const bool = {
    off: false,
    on: true,
    true: true,
    false: false,
};
const logic = {
    recommend_viable: true,
    recommend_questionable: false,
    sufficiently_close_bmdl: 3,
    rules: {
        [RULE_NAMES.BMD_MISSING]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: null, // null or float
            failure_bin: BINS.FAILURE,
        },
        [RULE_NAMES.BMDL_MISSING]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: null, // null or float
            failure_bin: BINS.FAILURE,
        },
        [RULE_NAMES.BMDU_MISSING]: {
            enabled_continuous: false,
            enabled_dichotomous: false,
            enabled_nested: false,
            threshold: null, // null or float
            failure_bin: BINS.WARNING,
        },
        [RULE_NAMES.AIC_MISSING]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: null, // null or float
            failure_bin: BINS.FAILURE,
        },
        [RULE_NAMES.ROI_MISSING]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: null, // null or float
            failure_bin: BINS.FAILURE,
        },
        [RULE_NAMES.VARIANCE_TYPE]: {
            enabled_continuous: true,
            enabled_dichotomous: false,
            enabled_nested: false,
            threshold: 0.05, // null or float
            failure_bin: BINS.WARNING,
        },
        [RULE_NAMES.VARIANCE_FIT]: {
            enabled_continuous: true,
            enabled_dichotomous: false,
            enabled_nested: false,
            threshold: 0.05, // null or float
            failure_bin: BINS.NO_CHANGE,
        },
        [RULE_NAMES.GOF]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: 0.1, // null or float
            failure_bin: BINS.NO_CHANGE,
        },
        [RULE_NAMES.GOF_CANCER]: {
            enabled_continuous: false,
            enabled_dichotomous: true,
            enabled_nested: false,
            threshold: 0.05, // null or float
            failure_bin: BINS.NO_CHANGE,
        },
        [RULE_NAMES.bmd_bmdl_ratio_fail]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: 20, // null or float
            failure_bin: BINS.NO_CHANGE,
        },
        [RULE_NAMES.BMD_BMDL_RATIO_WARN]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: 3, // null or float
            failure_bin: BINS.WARNING,
        },
        [RULE_NAMES.ROI_LARGE]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: 2, // null or float
            failure_bin: BINS.NO_CHANGE,
        },
        [RULE_NAMES.WARNINGS]: {
            enabled_continuous: false,
            enabled_dichotomous: false,
            enabled_nested: false,
            threshold: null, // null or float
            failure_bin: BINS.WARNING,
        },
        [RULE_NAMES.HIGH_BMD]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: 1, // null or float
            failure_bin: BINS.WARNING,
        },
        [RULE_NAMES.HIGH_BMDL]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: 1, // null or float
            failure_bin: BINS.WARNING,
        },
        [RULE_NAMES.LOW_BMD_WARN]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: 3, // null or float
            failure_bin: BINS.WARNING,
        },
        [RULE_NAMES.LOW_BMDL_WARN]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: 3, // null or float
            failure_bin: BINS.WARNING,
        },
        [RULE_NAMES.LOW_BMD_FAIL]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: 10, // null or float
            failure_bin: BINS.NO_CHANGE,
        },
        [RULE_NAMES.LOW_BMDL_FAIL]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: 10, // null or float
            failure_bin: BINS.NO_CHANGE,
        },
        [RULE_NAMES.CONTROL_RESIDUAL_HIGH]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: 2, // null or float
            failure_bin: BINS.WARNING,
        },
        [RULE_NAMES.CONTROL_STDEV_FIT]: {
            enabled_continuous: true,
            enabled_dichotomous: false,
            enabled_nested: false,
            threshold: 1.5, // null or float
            failure_bin: BINS.WARNING,
        },
        [RULE_NAMES.DOF_ZERO]: {
            enabled_continuous: true,
            enabled_dichotomous: true,
            enabled_nested: true,
            threshold: null, // null or float
            failure_bin: BINS.NO_CHANGE,
        },
    },
};

const headers = [
    "Test Description",
    "Continuous",
    "Dichotomous",
    "Nested",
    "Test Threshold",
    "Bin Placement if Test if Failed",
    "Notes to Show",
];

const decision_logic = {
    recommend_viable: "Recommend model in viable Bin",
    recommend_questionable: "Recommended model in Questionable Bin",
    sufficiently_close_bmdl:
        'BMDL range deemed "sufficiently close" to use lowest AIC instead of lowest BMDL in viable models',
};

const list = [
    {
        model: "BMD calculated",
        values: [
            {
                name: "bmd_missing-continuous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "bmd_missing-dichotomous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "bmd_missing-nested",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "bmd_missing-threshold",
                input: "text",
                value: "N/A",
                disabled: true,
            },
            {
                name: "bmd_missing-bin_placement",
                input: "",
                value: "Unusable Bin",
                disabled: false,
            },
            {
                name: "bmd_missing-notes_to_show",
                input: "",
                value: "BMD not estimated",
                disabled: false,
            },
        ],
    },
    {
        model: "BMDL calculated",
        values: [
            {
                name: "bmdl_missing-continuous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "bmdl_missing-dichotomous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "bmdl_missing-nested",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "bmdl_missing-threshold",
                input: "text",
                value: "N/A",
                disabled: true,
            },
            {
                name: "bmdl_missing-bin_placement",
                input: "",
                value: "Unusable Bin",
                disabled: false,
            },
            {
                name: "bmdl_missing-notes_to_show",
                input: "",
                value: "BMDL not estimated",
                disabled: false,
            },
        ],
    },
    {
        model: "BMDU calculated",
        values: [
            {
                name: "bmdu_missing-continuous",
                value: "off",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "bmdu_missing-dichotomous",
                value: "off",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "bmdu_missing-nested",
                value: "off",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "bmdu_missing-threshold",
                input: "text",
                value: "N/A",
                disabled: true,
            },
            {
                name: "bmdu_missing-bin_placement",
                input: "",
                value: "No Bin Change (Warning) ",
                disabled: false,
            },
            {
                name: "bmdu_missing-notes_to_show",
                input: "",
                value: "BMDU not estimated",
                disabled: false,
            },
        ],
    },
    {
        model: "AIC calculated",
        values: [
            {
                name: "aic_missing-continuous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "aic_missing-dichotomous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "aic_missing-nested",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "aic_missing-threshold",
                input: "text",
                value: "N/A",
                disabled: true,
            },
            {
                name: "aic_missing-bin_placement",
                input: "",
                value: "Unusable Bin",
                disabled: false,
            },
            {
                name: "aic_missing-notes_to_show",
                input: "",
                value: "AIC not estimated",
                disabled: false,
            },
        ],
    },
    {
        model: "Constant Variance",
        values: [
            {
                name: "variance_type-continuous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "variance_type-dichotomous",
                value: "off",
                input: "select",
                options: ["on", "off"],
                disabled: true,
            },
            {
                name: "variance_type-nested",
                value: "off",
                input: "select",
                options: ["on", "off"],
                disabled: true,
            },
            {
                name: "variance_type-threshold",
                input: "text",
                value: "0.05",
                disabled: false,
            },
            {
                name: "variance_type-bin_placement",
                input: "",
                value: "Questionable Bin",
                disabled: false,
            },
            {
                name: "variance_type-notes_to_show",
                input: "",
                value: "Constant variance test failed (Test 2 p-value<0.05)",
                disabled: false,
            },
        ],
    },
    {
        model: "Non-Constant Variance",
        values: [
            {
                name: "variance_fit-continuous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "variance_fit-dichotomous",
                value: "off",
                input: "select",
                options: ["on", "off"],
                disabled: true,
            },
            {
                name: "variance_fit-nested",
                value: "off",
                input: "select",
                options: ["on", "off"],
                disabled: true,
            },
            {
                name: "variance_fit-threshold",
                input: "text",
                value: "0.05",
                disabled: false,
            },
            {
                name: "variance_fit-placement",
                input: "",
                value: "Questionable Bin",
                disabled: false,
            },
            {
                name: "variance_fit_notes_to_show",
                input: "",
                value: "Non-Constant variance test failed (Test 2 p-value<0.05)",
                disabled: false,
            },
        ],
    },
    {
        model: "Goodness of fit p-test",
        values: [
            {
                name: "gof-continuous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "gof-dichotomous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "gof-nested",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "gof-threshold",
                input: "text",
                value: "0.1",
                disabled: false,
            },
            {
                name: "gof-bin_placement",
                input: "",
                value: "Questionable Bin",
                disabled: false,
            },
            {
                name: "gof-notes_to_show",
                input: "",
                value: "Goodness of fit p-value<0.1",
                disabled: false,
            },
        ],
    },
    {
        model: "Goodness of fit p-test (cancer)",
        values: [
            {
                name: "gof_cancer-continuous",
                value: "off",
                input: "select",
                options: ["on", "off"],
                disabled: true,
            },
            {
                name: "gof_cancer-dichotomous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "gof_cancer-nested",
                value: "off",
                input: "select",
                options: ["on", "off"],
                disabled: true,
            },
            {
                name: "gof_cancer-threshold",
                input: "text",
                value: "0.05",
                disabled: false,
            },
            {
                name: "gof_cancer-bin_placement",
                input: "",
                value: "Questionable Bin",
                disabled: false,
            },
            {
                name: "gof_cancer-notes_to_show",
                input: "",
                value: "Goodness of fit p-value<0.05",
                disabled: false,
            },
        ],
    },
    {
        model: "Ratio of BMD/BMDL (serious)",
        values: [
            {
                name: "bmd_bmdl_ratio_fail-continuous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "bmd_bmdl_ratio_fail-dichotomous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "bmd_bmdl_ratio_fail-nested",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "bmd_bmdl_ratio_fail-threshold",
                input: "text",
                value: "20",
                disabled: false,
            },
            {
                name: "bmd_bmdl_ratio_fail-bin_placement",
                input: "",
                value: "Questionable Bin",
                disabled: false,
            },
            {
                name: "bmd_bmdl_ratio_fail-notes_to_show",
                input: "",
                value: "BMD/BMDL ratio > 20",
                disabled: false,
            },
        ],
    },
    {
        model: "Ratio of BMD/BMDL (caution)",
        values: [
            {
                name: "bmd_bmdl_ratio_warn-continuous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "bmd_bmdl_ratio_warn-dichotomous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "bmd_bmdl_ratio_warn-nested",
                value: "On",
                input: "select",
                options: ["on", "off"],
            },
            {
                name: "bmd_bmdl_ratio_warn-threshold",
                input: "text",
                value: "3",
                disabled: false,
            },
            {
                name: "bmd_bmdl_ratio_warn-bin_placement",
                input: "",
                value: "No Bin Change (Warning)",
                disabled: false,
            },
            {
                name: "bmd_bmdl_ratio_warn-notes_to_show",
                input: "",
                value: "BMD/BMDL ratio > 3",
                disabled: false,
            },
        ],
    },
    {
        model: "Abs(Residual of interest) too large",
        values: [
            {
                name: "roi_large-continuous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "roi_large-dichotomous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "roi_large-nested",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "roi_large-threshold",
                input: "text",
                value: "2",
                disabled: false,
            },
            {
                name: "roi_large-bin_placement",
                input: "",
                value: "Questionable Bin",
                disabled: false,
            },
            {
                name: "roi_large-notes_to_show",
                input: "",
                value: "|Residual for Dose Group Near BMD| >2",
                disabled: false,
            },
        ],
    },
    {
        model: "BMDS model Warnings",
        values: [
            {
                name: "warnings-continuous",
                value: "off",
                input: "select",
                options: ["on", "off"],
                disabled: true,
            },
            {
                name: "warnings-dichotomous",
                value: "off",
                input: "select",
                options: ["on", "off"],
                disabled: true,
            },
            {
                name: "warnings-nested",
                value: "off",
                input: "select",
                options: ["on", "off"],
                disabled: true,
            },
            {
                name: "warnings-threshold",
                input: "text",
                value: "N/A",
                disabled: true,
            },
            {
                name: "warnings-bin_placement",
                input: "",
                value: "No Bin Change(warning)",
                disabled: true,
            },
            {
                name: "warnings-notes_to_show",
                input: "",
                value: "BMD output file included warning",
                disabled: true,
            },
        ],
    },
    {
        model: "BMD higher than higher dose",
        values: [
            {
                name: "high_bmd-continuous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "high_bmd-dichotomous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "high_bmd-nested",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "high_bmd-threshold",
                input: "text",
                value: "1",
                disabled: false,
            },
            {
                name: "high_bmd-bin_placement",
                input: "",
                value: "No Bin Change (Warning)",
                disabled: false,
            },
            {
                name: "high_bmd-notes_to_show",
                input: "",
                value: "BMD higher than maximum dose",
                disabled: false,
            },
        ],
    },
    {
        model: "BMDL higher than highest dose",
        values: [
            {
                name: "high_bmdl-continuous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "high_bmdl-dichotomous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "high_bmdl-nested",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "high_bmdl-threshold",
                input: "text",
                value: "1",
                disabled: false,
            },
            {
                name: "high_bmdl-bin_placement",
                input: "",
                value: "No Bin Change (Warning)",
            },
            {
                name: "high_bmdl-notes_to_show",
                input: "",
                value: "BMD higher than maximum dose",
                disabled: false,
            },
        ],
    },
    {
        model: "BMD lower than lowest dose (warning)",
        values: [
            {
                name: "low_bmd_warn-continuous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "low_bmd_warn-dichotomous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "low_bmd_warn-nested",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "low_bmd_warn-threshold",
                input: "text",
                value: "3",
                disabled: false,
            },
            {
                name: "low_bmd_warn-bin_placement",
                input: "",
                value: "No Bin Change (Warning)",
                disabled: false,
            },
            {
                name: "low_bmd_warn-notes_to_show",
                input: "",
                value: "BMDL 3x lower than lowest non-zero dose",
                disabled: false,
            },
        ],
    },
    {
        model: "BMDL lower than lowest dose (warning)",
        values: [
            {
                name: "low_bmdl_warn-continuous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "low_bmdl_warn-dichotomous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "low_bmdl_warn-nested",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "low_bmdl_warn-threshold",
                input: "text",
                value: "3",
                disabled: false,
            },
            {
                name: "low_bmdl_warn-bin_placement",
                input: "",
                value: "No Bin Change (Warning)",
                disabled: false,
            },
            {
                name: "low_bmdl_warn-notes_to_show",
                input: "",
                value: "BMDL 3x lower than lowest non-zero dose",
                disabled: false,
            },
        ],
    },
    {
        model: "BMD lower than lowest dose (serious)",
        values: [
            {
                name: "low_bmd_fail-continuous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "low_bmd_fail-dichotomous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "low_bmd_fail-nested",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "low_bmd_fail-threshold",
                input: "text",
                value: "10",
                disabled: false,
            },
            {
                name: "low_bmd_fail-bin_placement",
                input: "",
                value: "Questionable Bin",
                disabled: false,
            },
            {
                name: "low_bmd_fail-notes_to_show",
                input: "",
                value: "BMDL 10x lower than lowest non-zero dose",
                disabled: false,
            },
        ],
    },
    {
        model: "BMDL lower than lowest dose (serious)",
        values: [
            {
                name: "low_bmdl_fail-continuous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "low_bmdl_fail-dichotomous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "low_bmdl_fail-nested",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "low_bmdl_fail-threshold",
                input: "text",
                value: "10",
                disabled: false,
            },
            {
                name: "low_bmdl_fail-bin_placement",
                input: "",
                value: "Questionable Bin",
                disabled: false,
            },
            {
                name: "low_bmdl_fail-notes_to_show",
                input: "",
                value: "BMDL 10x lower than lowest non-zero dose",
                disabled: false,
            },
        ],
    },
    {
        model: "Abs(Residual at control) too large",
        values: [
            {
                name: "control_residual_high-continuous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "control_residual_high-dichotomous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "control_residual_high-nested",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "control_residual_high-threshold",
                input: "text",
                value: "2",
                disabled: false,
            },
            {
                name: "control_residual_high-bin_placement",
                input: "",
                value: "No Bin Change (Warning)",
                disabled: false,
            },
            {
                name: "control_residual_high-notes_to_show",
                input: "",
                value: "|Residual at control|>2",
                disabled: false,
            },
        ],
    },
    {
        model: "Poor control dose std. dev.",
        values: [
            {
                name: "control_stdev_fit-continuous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "control_stdev_fit-dichotomous",
                value: "off",
                input: "select",
                options: ["on", "off"],
                disabled: true,
            },
            {
                name: "control_stdev_fit-nested",
                value: "off",
                input: "select",
                options: ["on", "off"],
                disabled: true,
            },
            {
                name: "control_stdev_fit-threshold",
                input: "text",
                value: "1.5",
                disabled: false,
            },
            {
                name: "control_stdev_fit-bin_placement",
                input: "",
                value: "No Bin Change (Warning)",
                disabled: false,
            },
            {
                name: "control_stdev_fit-notes_to_show",
                input: "",
                value: "Modeled control response std. dev. >|1.5| actual response std. dev.",
                disabled: false,
            },
        ],
    },
    {
        model: "D.O.F equal 0",
        values: [
            {
                name: "dof_zero-continuous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "dof_zero-dichotomous",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "dof_zero-nested",
                value: "On",
                input: "select",
                options: ["on", "off"],
                disabled: false,
            },
            {
                name: "dof_zero-threshold",
                input: "text",
                value: "N/A",
                disabled: true,
            },
            {
                name: "dof_zero-bin_placement",
                input: "",
                value: "Questionable Bin",
                disabled: false,
            },
            {
                name: "dof_zero-notes_to_show",
                input: "",
                value: "d.f=0, saturated model (Goodness of fit test cannot be calculated)",
                disabled: false,
            },
        ],
    },
];

export {headers, list, logic, bool, decision_logic};
