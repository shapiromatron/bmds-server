import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import Plot from "react-plotly.js";
import PropTypes from "prop-types";

@inject("dataStore")
@observer
class DoseResponsePlot extends Component {
    render() {
        const {dataStore} = this.props;
        return <Plot data={dataStore.getDoseResponseData} layout={dataStore.getLayout} />;
    }
}
DoseResponsePlot.propTypes = {
    dataStore: PropTypes.object,
};
export default DoseResponsePlot;
