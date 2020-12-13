const modelTypes = [
        {value: "CS", name: "Continuous Summarized"},
        {value: "CI", name: "Continuous Individual"},
        {value: "DM", name: "Dichotomous"},
        {value: "N", name: "Nested"},
    ],
    columns = {
        CS: ["doses", "ns", "means", "stdevs"],
        CI: ["doses", "responses"],
        DM: ["doses", "ns", "incidences"],
        N: ["doses", "litter_sizes", "incidences", "litter_specific_covariates"],
    },
    columnNames = {
        CS: {
            doses: "Dose",
            ns: "N",
            means: "Mean",
            stdevs: "St. Dev.",
        },
        CI: {
            doses: "Dose",
            responses: "Response",
        },
        DM: {
            doses: "Dose",
            ns: "N",
            incidences: "Incidence",
        },
        N: {
            doses: "Dose",
            litter_sizes: "LItter Size",
            incidences: "Incidence",
            litter_specific_covariates: "Litter Specific Covariate",
        },
    },
    columnHeaders = {
        doses: "Dose",
        ns: "N",
        means: "Mean",
        stdevs: "St. Dev.",
        responses: "Response",
        incidences: "Incidence",
        litter_sizes: "Litter Size",
        litter_specific_covariates: "Litter Specific Covariate",
    },
    datasetForm = {
        CS: {
            doses: [0, 7, 37, 186],
            ns: [25, 25, 25, 24],
            means: [55.8, 52.9, 64.8, 119.9],
            stdevs: [12.5, 15.4, 17.4, 32.5],
            adverse_direction: "automatic",
        },
        CI: {
            doses: ["", "", "", "", ""],
            responses: ["", "", "", "", ""],
        },
        DM: {
            doses: [0, 0.46, 1.39, 4.17, 12.5],
            ns: [9, 9, 11, 10, 7],
            incidences: [0, 0, 3, 2, 3],
        },
        N: {
            doses: ["", "", "", "", ""],
            litter_sizes: ["", "", "", "", ""],
            incidences: ["", "", "", "", ""],
            litter_specific_covariates: ["", "", "", "", ""],
        },
    },
    datasetNamesHeaders = {
        C: ["Enable", "Datasets", "Adverse Direction"],
        D: ["Enable", "Datasets"],
        DM: ["Enable", "Datasets", "Degree", "Background"],
        N: ["Enable", "Datasets"],
    },
    AdverseDirectionList = [
        {value: "automatic", name: "Automatic"},
        {value: "up", name: "Up"},
        {value: "down", name: "Down"},
    ],
    degree = [
        {value: "auto-select", name: "auto-select"},
        {value: "1", name: "1"},
        {value: "2", name: "2"},
        {value: "3", name: "3"},
    ],
    background = [
        {value: "Estimated", name: "Esimated"},
        {value: "0", name: "Zero"},
    ],
    scatter_plot_layout = {
        showlegend: true,
        title: {
            text: "Scatter Plot",
            font: {
                family: "Courier New, monospace",
                size: 12,
            },
            xref: "paper",
        },
        xaxis: {
            linecolor: "black",
            linewidth: 1,
            mirror: true,
            title: {
                text: "",
                font: {
                    family: "Courier New, monospace",
                    size: 12,
                    color: "#7f7f7f",
                },
            },
        },
        yaxis: {
            linecolor: "black",
            linewidth: 1,
            mirror: true,
            title: {
                text: "",
                font: {
                    family: "Courier New, monospace",
                    size: 12,
                    color: "#7f7f7f",
                },
            },
        },
        plot_bgcolor: "",
        paper_bgcolor: "#eee",
        width: 400,
        height: 400,
        autosize: true,
    },
    yAxisTitle = {
        CI: "responses",
        CS: "means",
        DM: "incidences",
        N: "incidences",
    },
    model_type = {
        Continuous_Summarized: "CS",
        Continuous_Individual: "CI",
        Dichotomous: "DM",
        Nested: "N",
    };

export {
    modelTypes,
    columns,
    columnNames,
    columnHeaders,
    datasetForm,
    datasetNamesHeaders,
    AdverseDirectionList,
    degree,
    background,
    scatter_plot_layout,
    yAxisTitle,
    model_type,
};
