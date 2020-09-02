import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import Plot from "react-plotly.js";
import PropTypes from "prop-types";
import {toJS} from "mobx";

@inject("outputStore")
@observer
class ResponsePlot extends Component {
    constructor(props) {
        super(props);
        this.props.outputStore.setPlotData();
    }
    render() {
        const {outputStore} = this.props;
        let plotData = toJS(outputStore.plotData);
        return <Plot data={plotData} layout={outputStore.getLayout} />;
    }
}
ResponsePlot.propTypes = {
    outputStore: PropTypes.object,
    getPlotData: PropTypes.func,
    getBMDLine: PropTypes.func,
    getLayout: PropTypes.func,
};
export default ResponsePlot;
