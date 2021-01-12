import _ from "lodash";
import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
@inject("outputStore")
@observer
class SelectModelIndex extends Component {
    render() {
        const {outputStore} = this.props,
            {selectedOutput} = outputStore,
            {models} = selectedOutput,
            {model_index, notes} = selectedOutput.selected,
            selectValue = _.isNumber(model_index) ? model_index : -1,
            textValue = _.isNull(notes) ? "" : notes;

        return (
            <form>
                <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Selected best-fitting model</label>
                    <div className="col-sm-9">
                        <select
                            id="dataset-type"
                            className="form-control form-control-sm"
                            onChange={e =>
                                outputStore.saveSelectedModelIndex(parseInt(e.target.value))
                            }
                            value={selectValue}>
                            <option value={-1}>None</option>
                            {models.map((model, idx) => {
                                return (
                                    <option key={idx} value={idx}>
                                        {model.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Selection notes</label>
                    <div className="col-sm-9">
                        <textarea
                            className="form-control"
                            type="textarea"
                            rows="2"
                            value={textValue}
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
        );
    }
}
SelectModelIndex.propTypes = {
    outputStore: PropTypes.object,
};
export default SelectModelIndex;
