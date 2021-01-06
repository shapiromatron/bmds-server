import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
@inject("outputStore")
@observer
class SelectModelIndex extends Component {
    render() {
        const {outputStore} = this.props;

        return (
            <div>
                <form>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label p-0">Select Model</label>
                        <div className="col-sm-9">
                            <select
                                id="dataset-type"
                                className="form-control form-control-sm"
                                onChange={e => outputStore.saveSelectedModelIndex(e.target.value)}
                                value={
                                    outputStore.getCurrentOutput.selected_model_index === undefined
                                        ? "-1"
                                        : outputStore.getCurrentOutput.selected_model_index
                                }>
                                <option value="-1">None</option>
                                {outputStore.getCurrentOutput.models.map((model, i) => {
                                    return (
                                        <option key={i} value={model.model_index}>
                                            {model.model_name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label p-0">Notes</label>
                        <div className="col-sm-9">
                            <textarea
                                className="form-control"
                                type="textarea"
                                rows="2"
                                value={outputStore.getCurrentOutput.selected_model_notes}
                                onChange={e =>
                                    outputStore.saveSelectedIndexNotes(e.target.value)
                                }></textarea>
                        </div>
                    </div>

                    <div className="">
                        <div className="">
                            <button
                                type="button"
                                className="btn btn-sm btn-primary btn-lg btn-block pull-right col-sm-9"
                                onClick={() => outputStore.saveSelectedModel()}>
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
SelectModelIndex.propTypes = {
    outputStore: PropTypes.object,
    saveSelectedIndexNotes: PropTypes.func,
    saveSelectedModelIndex: PropTypes.func,
    saveSelectedModel: PropTypes.func,
};
export default SelectModelIndex;
