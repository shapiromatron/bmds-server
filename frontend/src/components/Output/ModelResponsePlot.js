import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import Plotly from "plotly.js";

@inject("outputStore")
@observer
class ModelResponsePlot extends Component {
    componentDidMount() {
        this.props.outputStore.getScatterPlotData(this.props.currentDataset);
        this.props.outputStore.layout.title.text = this.props.title;
        this.props.outputStore.plotData.push(this.props.outputStore.bmdLine);
        Plotly.react(
            "response-plot",
            this.props.outputStore.plotData,
            this.props.outputStore.layout
        );
    }
    render() {
        return <div id="response-plot"></div>;
    }
}

export default ModelResponsePlot;
