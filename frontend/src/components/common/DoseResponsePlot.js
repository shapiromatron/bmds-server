import React, {Component} from "react";
import {observer} from "mobx-react";
import Plot from "react-plotly.js";
import PropTypes from "prop-types";
import {toJS} from "mobx";

@observer
class DoseResponsePlot extends Component {
    render() {
        const {layout, data} = this.props,
            config = {responsive: true, staticPlot: true};

        return <Plot layout={toJS(layout)} data={toJS(data)} config={config} useResizeHandler />;
    }
}
DoseResponsePlot.propTypes = {
    layout: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
};
export default DoseResponsePlot;
