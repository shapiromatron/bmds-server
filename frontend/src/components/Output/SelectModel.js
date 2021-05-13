import _ from "lodash";
import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
@inject("outputStore")
@observer
class SelectModelIndex extends Component {
    render() {
        const {outputStore} = this.props,
            selectedOutput = outputStore.selectedOutput.frequentist,
            {models} = selectedOutput,
            {model_index, notes} = selectedOutput.selected,
            selectValue = _.isNumber(model_index) ? model_index : -1,
            textValue = _.isNull(notes) ? "" : notes;

        return (
            <form className="form-group row well py-2">
                <div className="col-md-4">
                    <label htmlFor="selectedModelIndex">Selected best-fitting model</label>
                    <select
                        id="selectedModelIndex"
                        className="form-control"
                        onChange={e => outputStore.saveSelectedModelIndex(parseInt(e.target.value))}
                        value={selectValue}>
                        <option key={-1} value={-1}>
                            None (no model selected)
                        </option>
                        {models.map((model, idx) => {
                            return (
                                <option key={idx} value={idx}>
                                    {model.name}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className="col-md-4">
                    <label htmlFor="selectedNotes">Selection notes</label>
                    <textarea
                        id="selectedNotes"
                        className="form-control"
                        type="textarea"
                        rows="3"
                        value={textValue}
                        onChange={e =>
                            outputStore.saveSelectedIndexNotes(e.target.value)
                        }></textarea>
                </div>
                <div className="col-md-4">
                    <label>&nbsp;</label>
                    <button
                        type="button"
                        className="btn btn-primary btn-block mt-1"
                        onClick={() => outputStore.saveSelectedModel()}>
                        Save model selection
                    </button>
                </div>
            </form>
        );
    }
}
SelectModelIndex.propTypes = {
    outputStore: PropTypes.object,
};
export default SelectModelIndex;
