import {toJS} from "mobx";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";
import Plot from "react-plotly.js";

import {getCdfLayout, getConfig} from "@/constants/plotting";

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
                line: {
                    width: 4,
                },
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

export default observer(CDFPlot);
