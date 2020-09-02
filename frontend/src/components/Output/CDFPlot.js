import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import Plot from "react-plotly.js";
import PropTypes from "prop-types";

@inject("outputStore")
@observer
class CDFPlot extends Component {
    render() {
        const {outputStore} = this.props;
        return (
            <div>
                <Plot data={outputStore.getCDFPlot} layout={outputStore.getCDFLayout} />
            </div>
        );
    }
}

CDFPlot.propTypes = {
    outputStore: PropTypes.object,
    getCDFPlot: PropTypes.func,
    getCDFPlotLayout: PropTypes.func,
};

export default CDFPlot;
