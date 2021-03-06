import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import {modelTypes} from "../../../constants/mainConstants";

import Spinner from "../../common/Spinner";

@inject("mainStore")
@observer
class AnalysisForm extends Component {
    render() {
        const {mainStore} = this.props;
        return (
            <div>
                <form className="table-primary p-3 mt-2">
                    <div className="form-group">
                        <label>Analysis Name</label>
                        <input
                            className="form-control"
                            type="text"
                            value={mainStore.analysis_name}
                            onChange={e => mainStore.changeAnalysisName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Analysis Description</label>
                        <textarea
                            className="form-control"
                            type="textarea"
                            rows="3"
                            value={mainStore.analysis_description}
                            onChange={e =>
                                mainStore.changeAnalysisDescription(e.target.value)
                            }></textarea>
                    </div>
                    <div className="form-group">
                        <label>Model Type</label>
                        <select
                            id="dataset-type"
                            className="form-control"
                            onChange={e => mainStore.changeDatasetType(e.target.value)}
                            value={mainStore.model_type}>
                            {modelTypes.map((item, i) => {
                                return (
                                    <option key={i} value={item.value}>
                                        {item.name}
                                    </option>
                                );
                            })}
                        </select>
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
                                    <b>Steps required to save and/or execute:</b>
                                </p>
                                <p>
                                    {mainStore.hasAtLeastOneModelSelected ? (
                                        <i className="fa fa-check-circle fa-lg text-success"></i>
                                    ) : (
                                        <i className="fa fa-times-circle fa-lg text-danger"></i>
                                    )}
                                    &nbsp; At least one model is selected
                                </p>
                                <p>
                                    {mainStore.hasAtLeastOneDatasetSelected ? (
                                        <i className="fa fa-check-circle fa-lg text-success"></i>
                                    ) : (
                                        <i className="fa fa-times-circle fa-lg text-danger"></i>
                                    )}
                                    &nbsp; At least one dataset is selected
                                </p>
                                <p>
                                    {mainStore.hasAtLeastOneOptionSelected ? (
                                        <i className="fa fa-check-circle fa-lg text-success"></i>
                                    ) : (
                                        <i className="fa fa-times-circle fa-lg text-danger"></i>
                                    )}
                                    &nbsp; At least one option is selected
                                </p>
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
                                    disabled={!mainStore.isReadyToExecute}
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
