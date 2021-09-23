import React, {Component} from "react";
import {observer} from "mobx-react";
import Plot from "react-plotly.js";
import PropTypes from "prop-types";
import {toJS} from "mobx";

import {getConfig} from "../../constants/plotting";

@observer
class DoseResponsePlot extends Component {
    render() {
        const {layout, data, onRelayout} = this.props;

        return (
            <Plot
                layout={toJS(layout)}
                data={toJS(data)}
                config={getConfig()}
                style={{width: "100%"}}
                onRelayout={onRelayout ? e => onRelayout(e) : undefined}
                useResizeHandler={true}
            />
        );
    }
}
DoseResponsePlot.propTypes = {
    layout: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    onRelayout: PropTypes.func,
};
export default DoseResponsePlot;
