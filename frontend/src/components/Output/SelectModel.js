import _ from "lodash";
import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

import SelectInput from "../common/SelectInput";
import LabelInput from "../common/LabelInput";

@inject("outputStore")
@observer
class SelectModelIndex extends Component {
    render() {
        const {outputStore} = this.props,
            selectedOutput = outputStore.selectedOutput.frequentist,
            {models} = selectedOutput,
            {model_index, notes} = selectedOutput.selected,
            selectValue = _.isNumber(model_index) ? model_index : -1,
            textValue = _.isNull(notes) ? "" : notes,
            choices = models.map((model, idx) => {
                return {value: idx, text: model.name};
            });

        choices.unshift({value: -1, text: "None (no model selected)"});

        return (
            <form className="form-group row well py-2">
                <div className="col-md-4">
                    <SelectInput
                        label="Selected best-fitting model"
                        onChange={value => outputStore.saveSelectedModelIndex(parseInt(value))}
                        value={selectValue}
                        choices={choices}
                    />
                </div>
                <div className="col-md-4">
                    <LabelInput label="Selection notes" />
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
