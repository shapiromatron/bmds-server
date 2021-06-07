import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("outputStore")
@observer
class OutputSelector extends Component {
    render() {
        const store = this.props.outputStore;
        return (
            <div className="mt-2">
                <select
                    id="dataset-type"
                    className="form-control"
                    onChange={e => store.setSelectedOutputIndex(parseInt(e.target.value))}
                    value={store.selectedOutputIndex}>
                    {store.outputs.map((output, i) => {
                        return (
                            <option key={i} value={i}>
                                {store.getOutputName(i)}
                            </option>
                        );
                    })}
                </select>
            </div>
        );
    }
}
OutputSelector.propTypes = {
    outputStore: PropTypes.object,
};
export default OutputSelector;
