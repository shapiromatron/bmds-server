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
    plot_bgcolor: "",
    paper_bgcolor: "#eee",
    width: 400,
    height: 400,
    autosize: true,
};

@observer
class CDFPlot extends Component {
    render() {
        const cdf = toJS(this.props.cdf),
            data = {
                x: cdf[0],
                y: cdf[1],
                mode: "markers",
                type: "scatter",
                name: "CDF",
            };
        return <Plot data={[data]} layout={layout} />;
    }
}

CDFPlot.propTypes = {
    cdf: PropTypes.array,
};

export default CDFPlot;
