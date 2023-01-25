import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

import * as mc from "../../../constants/mainConstants";
import Button from "../../common/Button";
import SelectInput from "../../common/SelectInput";
import Spinner from "../../common/Spinner";
import TextAreaInput from "../../common/TextAreaInput";
import TextInput from "../../common/TextInput";

@observer
class RunChecklist extends Component {
    render() {
        const {complete, message} = this.props,
            color = complete ? "text-success" : "text-danger",
            icon = complete ? "fa-check-circle" : "fa-times-circle";

        return (
            <p>
                <i className={`fa fa-lg ${icon} ${color}`}></i>&ensp;{message}
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
                        <TextInput
                            id="analysis_name"
                            label="Analysis Name"
                            value={mainStore.analysis_name}
                            onChange={mainStore.changeAnalysisName}
                        />
                    </div>
                    <div className="form-group">
                        <TextAreaInput
                            id="analysis_description"
                            label="Analysis Description"
                            value={mainStore.analysis_description}
                            onChange={mainStore.changeAnalysisDescription}
                        />
                    </div>
                    <div className="form-group">
                        <SelectInput
                            id="analysis_model_type"
                            label="Model Type"
                            onChange={mainStore.changeDatasetType}
                            value={mainStore.model_type}
                            choices={mainStore.getModelTypeChoices}
                        />
                    </div>

                    {mainStore.errorMessage ? (
                        <div className="alert alert-danger">{mainStore.errorMessage}</div>
                    ) : null}
                    <div id="controlPanel" className="card bg-light">
                        {mainStore.isExecuting ? (
                            <div className="card-body">
                                <Button
                                    className="btn btn-warning float-right"
                                    onClick={mainStore.executeResetAnalysis}
                                    text="Cancel execution"
                                />
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
                                {mainStore.model_type === mc.MODEL_MULTI_TUMOR ? (
                                    <RunChecklist
                                        complete={mainStore.hasAtLeastTwoDatasetsSelected}
                                        message="At least two datasets are selected"
                                    />
                                ) : (
                                    <RunChecklist
                                        complete={mainStore.hasAtLeastOneDatasetSelected}
                                        message="At least one dataset is selected"
                                    />
                                )}
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
                                <Button
                                    className="btn btn-primary mr-2"
                                    onClick={mainStore.saveAnalysis}
                                    text="Save Analysis"
                                />
                                <Button
                                    className="btn btn-primary"
                                    onClick={mainStore.executeAnalysis}
                                    disabled={!mainStore.analysisSavedAndValidated}
                                    text="Run Analysis"
                                />
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
