export const datasetNamesHeaders = {
    C: ["Enable", "Datasets", "Adverse Direction"],
    D: ["Enable", "Datasets"],
    DM: ["Enable", "Datasets", "Degree", "Background"],
    N: ["Enable", "Datasets"],
};

export const AdverseDirectionList = [
    {value: "automatic", name: "Automatic"},
    {value: "up", name: "Up"},
    {value: "down", name: "Down"},
];
export const degree = [
    {value: "auto-select", name: "auto-select"},
    {value: "1", name: "1"},
    {value: "2", name: "2"},
    {value: "3", name: "3"},
];
export const background = [
    {value: "Estimated", name: "Esimated"},
    {value: "0", name: "Zero"},
];

export const modelTypes = [
    {name: "Continuous", value: "C"},
    {name: "Dichotomous", value: "D"},
    {name: "Dichotomous-Multi-tumor (MS_Combo)", value: "DM"},
    {name: "Dichotomous-Nested", value: "N"},
];
