import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import Plot from "react-plotly.js";
import PropTypes from "prop-types";

@inject("dataStore")
@observer
class ScatterPlot extends Component {
    render() {
        const {dataStore} = this.props;
        return <Plot data={dataStore.getScatterPlotData} layout={dataStore.getLayout} />;
    }
}
ScatterPlot.propTypes = {
    dataStore: PropTypes.object,
    getScatterPlotData: PropTypes.func,
    getLayout: PropTypes.func,
};
export default ScatterPlot;
