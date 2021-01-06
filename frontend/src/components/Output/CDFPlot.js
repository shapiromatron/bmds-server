import React, {Component} from "react";
import {observer} from "mobx-react";
import Plot from "react-plotly.js";
import PropTypes from "prop-types";
import {toJS} from "mobx";

const layout = {
    showlegend: true,
    title: {
        text: "CDF Plot",
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
            text: "Dose (mg/kg-day)",
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
            text: "Percentile",
            font: {
                family: "Courier New, monospace",
                size: 12,
                color: "#7f7f7f",
            },
        },
    },
};

@observer
class CDFPlot extends Component {
    render() {
        const {store} = this.props,
            cdf = toJS(store.selectedModel.results.fit.bmd_dist),
            data = {
                x: cdf[0],
                y: cdf[1],
                mode: "lines+markers",
                type: "scatter",
                name: "CDF",
            };
        return <Plot data={[data]} layout={layout} useResizeHandler />;
    }
}

CDFPlot.propTypes = {
    store: PropTypes.object,
};

export default CDFPlot;
