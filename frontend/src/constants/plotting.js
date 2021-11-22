import _ from "lodash";
import {Dtype} from "./dataConstants";
import {continuousErrorBars, dichotomousErrorBars} from "../utils/errorBars";

const doseResponseLayout = {
        autosize: true,
        legend: {yanchor: "top", y: 0.99, xanchor: "left", x: 0.01},
        margin: {l: 50, r: 5, t: 50, b: 50},
        showlegend: true,
        title: {
            text: "ADD",
        },
        xaxis: {
            title: {
                text: "ADD",
            },
        },
        yaxis: {
            title: {
                text: "ADD",
            },
        },
    },
    getResponse = dataset => {
        let incidences, ns;

        switch (dataset.dtype) {
            case Dtype.CONTINUOUS:
                return dataset.means;
            case Dtype.CONTINUOUS_INDIVIDUAL:
                return dataset.responses;
            case Dtype.DICHOTOMOUS:
                ns = dataset.ns;
                incidences = dataset.incidences;
                return _.range(ns.length).map(idx => incidences[idx] / ns[idx]);
            case Dtype.NESTED_DICHOTOMOUS:
                ns = dataset.litter_ns;
                incidences = dataset.incidences;
                return _.range(ns.length).map(idx => incidences[idx] / ns[idx]);
            default:
                throw `Unknown dtype: ${dataset.dtype}`;
        }
    };

export const getDrLayout = function(dataset, selected, modal, hover) {
        let layout = _.cloneDeep(doseResponseLayout),
            xlabel = dataset.metadata.dose_name,
            ylabel = dataset.metadata.response_name;

        if (dataset.metadata.dose_units) {
            xlabel = `${xlabel} (${dataset.metadata.dose_units})`;
        }

        if (dataset.metadata.response_units) {
            ylabel = `${ylabel} (${dataset.metadata.response_units})`;
        }

        const annotations = [];
        if (selected && selected.annotations) {
            annotations.push(selected.annotations);
        }
        if (modal && modal.annotations) {
            annotations.push(modal.annotations);
        }
        if (hover && hover.annotations) {
            annotations.push(hover.annotations);
        }
        layout.annotations = _.flatten(annotations);

        layout.title.text = dataset.metadata.name;
        layout.xaxis.title.text = xlabel;
        layout.yaxis.title.text = ylabel;
        const xmin = _.min(dataset.doses) || 0,
            xmax = _.max(dataset.doses) || 0,
            response = getResponse(dataset),
            ymin =
                dataset.dtype == Dtype.CONTINUOUS
                    ? _.min(response) - _.max(continuousErrorBars(dataset).uppers)
                    : _.min(response) || 0,
            ymax =
                dataset.dtype == Dtype.CONTINUOUS
                    ? _.max(response) + _.max(continuousErrorBars(dataset).uppers)
                    : _.max(response) || 0,
            xbuff = Math.abs(xmax - xmin) * 0.05,
            ybuff = Math.abs(ymax - ymin) * 0.05;

        layout.xaxis.range = [xmin == 0 ? -xbuff : xmin - xbuff, xmax == 0 ? xbuff : xmax + xbuff];
        layout.yaxis.range =
            dataset.dtype == Dtype.DICHOTOMOUS || dataset.dtype == Dtype.NESTED_DICHOTOMOUS
                ? [-0.05, 1.05]
                : [ymin == 0 ? -ybuff : ymin - ybuff, ymax == 0 ? ybuff : ymax + ybuff];

        // determine whether to position legend to the left or right; auto doesn't work
        const maxResponseIndex = response.indexOf(_.max(response)),
            maxResponseDose = dataset.doses[maxResponseIndex],
            doseRange = _.max(dataset.doses) - _.min(dataset.doses);

        if (maxResponseDose < doseRange / 2) {
            layout.legend.xanchor = "right";
            layout.legend.x = 1;
        } else {
            layout.legend.xanchor = "left";
            layout.legend.x = 0.05;
        }
        return layout;
    },
    getCdfLayout = function(dataset) {
        let layout = _.cloneDeep(doseResponseLayout),
            xlabel = dataset.metadata.dose_name;

        if (dataset.metadata.dose_units) {
            xlabel = `${xlabel} (${dataset.metadata.dose_units})`;
        }
        layout.title.text = "BMD Cumulative distribution function";
        layout.xaxis.title.text = xlabel;
        layout.yaxis.title.text = "Percentile";
        layout.yaxis.range = [0, 1];

        return layout;
    },
    getDrDatasetPlotData = function(dataset) {
        let errorBars, hovertemplate;
        if (dataset.dtype == Dtype.CONTINUOUS) {
            errorBars = continuousErrorBars(dataset);
        }
        if (dataset.dtype == Dtype.DICHOTOMOUS) {
            errorBars = dichotomousErrorBars(dataset);
        }
        if (errorBars) {
            hovertemplate = "%{y:.3f} (%{customdata[0]:.3f}, %{customdata[1]:.3f})<extra></extra>";
        }
        return {
            x: dataset.doses.slice(),
            y: getResponse(dataset).slice(),
            mode: "markers",
            type: "scatter",
            marker: {
                size: 10,
            },
            error_y: errorBars,
            customdata: errorBars ? errorBars.bounds : undefined,
            hovertemplate,
            name: "Response",
        };
    },
    getDrBmdLine = function(model, hexColor) {
        const annotations = [];
        if (model.results.bmd) {
            // https://plotly.com/javascript/reference/layout/annotations/#layout-annotations
            annotations.push({
                x: model.results.bmd,
                y: model.results.plotting.bmd_y,
                text: "BMD",
                showarrow: true,
                arrowhead: 6,
                arrowsize: 1.5,
                arrowcolor: hexColor,
                ax: 0,
                ay: -30,
                ayref: "pixel",
                bgcolor: "white",
            });
        }
        if (model.results.bmdl) {
            annotations.push({
                x: model.results.bmdl,
                y: model.results.plotting.bmdl_y,
                text: "BMDL",
                showarrow: true,
                arrowhead: 6,
                arrowsize: 1.5,
                arrowcolor: hexColor,
                ax: 0,
                ay: -30,
                ayref: "pixel",
                bgcolor: "white",
            });
        }

        return {
            x: model.results.plotting.dr_x,
            y: model.results.plotting.dr_y,
            mode: "lines",
            name: model.name,
            line: {
                color: hexColor,
                width: 4,
            },
            annotations,
        };
    },
    getBayesianBMDLine = function(model, hexColor) {
        const annotations = [];
        if (model.results.bmd) {
            // https://plotly.com/javascript/reference/layout/annotations/#layout-annotations
            annotations.push({
                x: model.results.bmd,
                y: model.results.bmd_y,
                text: "BMD",
                showarrow: true,
                arrowhead: 6,
                arrowsize: 1.5,
                arrowcolor: hexColor,
                ay: -30,
                ax: 0,
                ayref: "pixel",
                bgcolor: "white",
            });
        }
        if (model.results.bmdl) {
            annotations.push({
                x: model.results.bmdl,
                y: model.results.bmdl_y,
                text: "BMDL",
                showarrow: true,
                arrowhead: 6,
                arrowsize: 1.5,
                arrowcolor: hexColor,
                ay: -30,
                ax: 0,
                ayref: "pixel",
                bgcolor: "white",
            });
        }
        let bma_data = {
            x: model.results.dr_x,
            y: model.results.dr_y,
            name: "BMA",
            line: {
                width: 6,
                color: hexColor,
            },
            annotations,
        };
        return bma_data;
    },
    getLollipopDataset = function(dataArray, modelArray, modelName) {
        return {
            x: dataArray,
            y: modelArray,
            mode: "line",
            type: "scatter",
            line: {
                width: 5,
                color: "#696969",
            },
            marker: {
                size: 10,
                color: ["#FFFFFF", "#0000FF", "#FFFFFF"],
            },
            name: modelName,
        };
    },
    getLollipopPlotLayout = {
        title: "",
        showlegend: false,
        xaxis: {
            showline: true,
        },
        yaxis: {
            showline: true,
        },
    },
    getConfig = function() {
        return {
            modeBarButtonsToRemove: [
                "pan2d",
                "select2d",
                "lasso2d",
                "zoomIn2d",
                "zoomOut2d",
                "autoScale2d",
                "hoverClosestCartesian",
                "hoverCompareCartesian",
                "toggleSpikelines",
            ],
        };
    },
    bmaColor = "#00008b",
    colorCodes = [
        // adapted from https://observablehq.com/@d3/color-schemes
        "#e41a1c",
        "#377eb8",
        "#4daf4a",
        "#984ea3",
        "#ff7f00",
        "#edc949",
        "#a65628",
        "#f781bf",
        "#999999",
        "#e41a1c",
        "#377eb8",
        "#4daf4a",
        "#984ea3",
        "#ff7f00",
        "#edc949",
        "#a65628",
        "#f781bf",
        "#999999",
    ];
