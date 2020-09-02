import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import Plot from "react-plotly.js";
import PropTypes from "prop-types";

@inject("dataStore")
@observer
class ScatterPlot extends Component {
    render() {
        const {dataStore} = this.props;
        let layout = dataStore.getLayout;
        layout.title.text = dataStore.getModelTypesName.name + " Scatter Plot";
        return (
            <div>
                <Plot data={dataStore.getScatterPlotData} layout={layout} />
            </div>
        );
    }
}
ScatterPlot.propTypes = {
    dataStore: PropTypes.object,
    getScatterPlotData: PropTypes.func,
    getLayout: PropTypes.func,
};
export default ScatterPlot;
