import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import Plot from "react-plotly.js";
import PropTypes from "prop-types";
import {toJS} from "mobx";

@inject("outputStore")
@observer
class ResponsePlot extends Component {
    componentDidMount() {
        this.props.outputStore.setPlotData();
    }

    render() {
        const {outputStore} = this.props;
        let plotData = toJS(outputStore.plotData);
        var config = {responsive: true, staticPlot: true};
        return (
            <div>
                <Plot
                    data={plotData}
                    layout={outputStore.getLayout}
                    config={config}
                    useResizeHandler
                />
            </div>
        );
    }
}
ResponsePlot.propTypes = {
    outputStore: PropTypes.object,
};
export default ResponsePlot;
