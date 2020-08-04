import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import Plotly from "plotly.js";

@inject("outputStore")
@observer
class ResponsePlot extends Component {
    componentDidMount() {
        this.createScatterPlot();
    }
    componentDidUpdate() {
        this.createScatterPlot();
    }

    createScatterPlot() {
        this.props.outputStore.getScatterPlotData(this.props.currentDataset);
        this.props.outputStore.plotData.push(this.props.outputStore.bmdLine);
        this.props.outputStore.layout.title.text = this.props.title;
        return Plotly.react(
            "scatter-plot",
            this.props.outputStore.plotData,
            this.props.outputStore.layout
        );
    }
    render() {
        const {outputStore} = this.props;
        // eslint-disable-next-line no-unused-vars
        let bmdLine = outputStore.bmdLine;
        return <div id="scatter-plot"></div>;
    }
}

export default ResponsePlot;
