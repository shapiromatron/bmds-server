import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import Plotly from "plotly.js";

@inject("outputStore")
@observer
class DatasetPlot extends Component {
    componentDidMount() {
        this.props.outputStore.setPlotData();
        let data = this.props.outputStore.plotData;
        if (data != null && !("error" in data)) {
            var layout = this.props.outputStore.layout;
            layout.title.text = this.props.outputStore.selectedModel.model_name + " Plot";
            Plotly.newPlot("myDiv", data, layout);
        }
    }
    componentDidUpdate() {
        let data = this.props.outputStore.plotData;
        if (data != null && !("error" in data)) {
            var layout = this.props.outputStore.layout;
            layout.title.text = this.props.outputStore.selectedModel.model_name + " Plot";
            Plotly.newPlot("myDiv", data, layout);
        }
    }
    render() {
        let data = this.props.outputStore.plotData;
        if (data.length > 2) {
            this.componentDidUpdate();
        }
        return <div id="myDiv"></div>;
    }
}

export default DatasetPlot;
