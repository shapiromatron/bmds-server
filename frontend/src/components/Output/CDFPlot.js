import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import Plot from "react-plotly.js";

@inject("outputStore")
@observer
class CDFPlot extends Component {
    render() {
        const {outputStore} = this.props;
        return (
            <div>
                <Plot data={outputStore.cdfPlot} layout={outputStore.getCDFPlotLayout} />
            </div>
        );
    }
}

export default CDFPlot;
