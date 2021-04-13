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
        let errorBars = undefined;
        if (dataset.dtype == Dtype.CONTINUOUS) {
            errorBars = continuousErrorBars(dataset);
        }
        if (dataset.dtype == Dtype.DICHOTOMOUS) {
            errorBars = dichotomousErrorBars(dataset);
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
            hovertemplate:
                "%{y:.3f} (%{error_y.array:.3f}, %{error_y.arrayminus:.3f})<extra></extra>",
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
                ay: 0,
                ax: 0,
                ayref: "y",
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
                ay: 0,
                ax: 0,
                ayref: "y",
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
    };
