import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import Plotly from "plotly.js";

@inject("dataStore")
@observer
class DatasetScatterplot extends Component {
    componentDidMount() {
        let data = this.props.dataStore.plotData;
        let layout = this.props.dataStore.layout;
        Plotly.newPlot("scatter-plot", data, layout);
    }
    componentDidUpdate() {
        let data = this.props.dataStore.plotData;
        let layout = this.props.dataStore.layout;
        Plotly.newPlot("scatter-plot", data, layout);
    }
    render() {
        let index = this.props.dataStore.selectedDatasetIndex;
        this.props.dataStore.setPlotData(index);
        return <div id="scatter-plot"></div>;
    }
}

export default DatasetScatterplot;
