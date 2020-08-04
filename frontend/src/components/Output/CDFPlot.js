import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import Plotly from "plotly.js";

@inject("outputStore")
@observer
class CDFPlot extends Component {
    componentDidMount() {
        this.props.outputStore.setCDFPlot();
        Plotly.react("cdf-plot", this.props.outputStore.cdfPlot, this.props.outputStore.cdfLayout);
    }
    render() {
        return <div id="cdf-plot"></div>;
    }
}

export default CDFPlot;
