import PropTypes from "prop-types";
import React, {Component} from "react";
import {createRoot} from "react-dom/client";
import Plot from "react-plotly.js";

class PlotlyFigure extends Component {
    render() {
        const {data, layout} = this.props;
        return (
            <Plot
                data={data}
                layout={layout}
                style={{height: "100%", width: "100%"}}
                useResizeHandler={true}
            />
        );
    }
}
PlotlyFigure.propTypes = {
    data: PropTypes.array,
    layout: PropTypes.object,
};

const renderPlotlyFigure = function(el, data) {
    const root = createRoot(el);
    root.render(<PlotlyFigure {...data} />);
};

export {renderPlotlyFigure};
export default PlotlyFigure;
