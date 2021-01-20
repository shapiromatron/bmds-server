import _ from "lodash";

import {Dtype} from "./dataConstants";

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

export const getDrLayout = function(dataset) {
        let layout = _.cloneDeep(doseResponseLayout),
            xlabel = dataset.metadata.dose_name,
            ylabel = dataset.metadata.response_name;

        if (dataset.metadata.dose_units) {
            xlabel = `${xlabel} (${dataset.metadata.dose_units})`;
        }

        if (dataset.metadata.response_units) {
            ylabel = `${ylabel} (${dataset.metadata.response_units})`;
        }

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
        return {
            x: dataset.doses.slice(),
            y: getResponse(dataset).slice(),
            mode: "markers",
            type: "scatter",
            name: "Response",
        };
    },
    getDrBmdLine = function(model, hexColor) {
        return {
            x: model.results.dr_x,
            y: model.results.dr_y,
            mode: "lines",
            name: model.name,
            marker: {
                color: hexColor,
            },
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
