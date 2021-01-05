export const VERSION_330 = "BMDS330",
    MODEL_CONTINUOUS = "C",
    MODEL_DICHOTOMOUS = "D",
    MODEL_NESTED = "N",
    MODEL_MULTI_TUMOR = "DM",
    modelTypes = [
        {name: "Continuous", value: MODEL_CONTINUOUS},
        {name: "Dichotomous", value: MODEL_DICHOTOMOUS},
        // {name: "Dichotomous-Multi-tumor (MS_Combo)", value: MODEL_MULTI_TUMOR},
        // {name: "Dichotomous-Nested", value: MODEL_NESTED},
    ],
    datasetNamesHeaders = {
        [MODEL_CONTINUOUS]: ["Enable", "Datasets", "Adverse Direction"],
        [MODEL_DICHOTOMOUS]: ["Enable", "Datasets"],
        [MODEL_MULTI_TUMOR]: ["Enable", "Datasets", "Degree", "Background"],
        [MODEL_NESTED]: ["Enable", "Datasets"],
    };
