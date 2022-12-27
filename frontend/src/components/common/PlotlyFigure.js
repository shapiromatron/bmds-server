import React, {Component} from "react";
import Plot from "react-plotly.js";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";

class PlotlyFigure extends Component {
    render() {
        const {data, layout} = this.props;
        return <Plot data={data} layout={layout} style={{width: "100%"}} useResizeHandler={true} />;
    }
}
PlotlyFigure.propTypes = {
    data: PropTypes.array,
    layout: PropTypes.object,
};

const renderPlotlyFigure = function(el, data) {
    ReactDOM.render(<PlotlyFigure {...data} />, el);
};

export {renderPlotlyFigure};
export default PlotlyFigure;
