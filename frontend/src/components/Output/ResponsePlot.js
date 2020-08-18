import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import Plot from "react-plotly.js";

@inject("outputStore")
@observer
class ResponsePlot extends Component {
    constructor(props) {
        super(props);
        this.props.outputStore.setPlotData();
    }
    render() {
        const {outputStore} = this.props;
        return <Plot data={outputStore.plotData} layout={outputStore.getLayout} />;
    }
}

export default ResponsePlot;
