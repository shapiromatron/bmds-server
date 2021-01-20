import _ from "lodash";
import React, {Component} from "react";
import {observer} from "mobx-react";
import Plot from "react-plotly.js";
import PropTypes from "prop-types";
import {toJS} from "mobx";
import {getCdfLayout, getConfig} from "../../constants/plotting";

@observer
class CDFPlot extends Component {
    render() {
        const {dataset} = this.props,
            layout = getCdfLayout(dataset),
            cdf = toJS(this.props.cdf),
            data = {
                x: cdf[0],
                y: cdf[1],
                mode: "lines",
                type: "line",
                name: "BMD",
            };
        return (
            <Plot
                data={[data]}
                layout={layout}
                config={getConfig()}
                style={{width: "100%"}}
                useResizeHandler={true}
            />
        );
    }
}

CDFPlot.propTypes = {
    dataset: PropTypes.object,
    cdf: PropTypes.array,
};

export default CDFPlot;
