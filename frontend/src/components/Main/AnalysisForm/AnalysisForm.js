import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import {modelTypes} from "../../../constants/mainConstants";

import Spinner from "../../common/Spinner";
import SelectInput from "../../common/SelectInput";
import TextInput from "../../common/TextInput";
import LabelInput from "../../common/LabelInput";

@observer
class RunChecklist extends Component {
    render() {
        const {complete, message} = this.props,
            color = complete ? "text-success" : "text-danger";
        return (
            <p>
                <i className={`fa fa-check-circle fa-lg ${color}`}></i>&ensp;{message}
            </p>
        );
    }
}
RunChecklist.propTypes = {
    complete: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
};

@inject("mainStore")
@observer
class AnalysisForm extends Component {
    render() {
        const {mainStore} = this.props;
        return (
            <div>
                <form className="bg-custom p-3 mt-2">
                    <div className="form-group">
                        <LabelInput label="Analysis Name" />
                        <TextInput
                            value={mainStore.analysis_name}
                            onChange={value => mainStore.changeAnalysisName(value)}
                        />
                    </div>
                    <div className="form-group">
                        <LabelInput label="Analysis Description" />
                        <textarea
                            id="analysisDescription"
                            className="form-control"
                            type="textarea"
                            rows="3"
                            value={mainStore.analysis_description}
                            onChange={e =>
                                mainStore.changeAnalysisDescription(e.target.value)
                            }></textarea>
                    </div>
                    <div className="form-group">
                        <LabelInput label="Model Type" />
                        <SelectInput
                            onChange={value => mainStore.changeDatasetType(value)}
                            value={mainStore.model_type}
                            choices={modelTypes.map((item, i) => {
                                return {value: item.value, text: item.name};
                            })}
                        />
                    </div>

                    {mainStore.errorMessage ? (
                        <div className="alert alert-danger">{mainStore.errorMessage}</div>
                    ) : null}
                    <div className="card bg-light">
                        {mainStore.isExecuting ? (
                            <div className="card-body">
                                <button
                                    type="button"
                                    className="btn btn-warning float-right"
                                    onClick={() => mainStore.executeResetAnalysis()}>
                                    Cancel execution
                                </button>
                                <Spinner text="Executing, please wait..." />
                            </div>
                        ) : (
                            <div className="card-body">
                                <p>
                                    <b>Steps required to run the analysis:</b>
                                </p>
                                <RunChecklist
                                    complete={mainStore.hasAtLeastOneModelSelected}
                                    message="At least one model is selected"
                                />
                                <RunChecklist
                                    complete={mainStore.hasAtLeastOneDatasetSelected}
                                    message="At least one dataset is selected"
                                />
                                <RunChecklist
                                    complete={mainStore.hasAtLeastOneOptionSelected}
                                    message="At least one option is selected"
                                />
                                <RunChecklist
                                    complete={mainStore.analysisSavedAndValidated}
                                    message="The analysis has been saved"
                                />
                            </div>
                        )}

                        {mainStore.isValid && !mainStore.isExecuting ? (
                            <div className="card-footer btn-toolbar btn-group">
                                <button
                                    type="button"
                                    className="btn btn-primary mr-2"
                                    onClick={() => mainStore.saveAnalysis()}>
                                    Save Analysis
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    disabled={!mainStore.analysisSavedAndValidated}
                                    onClick={() => mainStore.executeAnalysis()}>
                                    Run Analysis
                                </button>
                            </div>
                        ) : null}
                    </div>
                </form>
            </div>
        );
    }
}
AnalysisForm.propTypes = {
    mainStore: PropTypes.object,
};
export default AnalysisForm;
