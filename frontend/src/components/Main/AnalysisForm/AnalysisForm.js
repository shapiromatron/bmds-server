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
            <form className="analysis-form table-primary ">
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
                    <label>Select Model Type</label>
                    <select
                        id="dataset-type"
                        className="form-control"
                        onChange={e => mainStore.changeDatasetType(e.target.value)}
                        value={mainStore.dataset_type}>
                        {modelTypes.map((item, i) => {
                            return (
                                <option key={i} value={item.value}>
                                    {item.name}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className="btn-toolbar btn-group form-group" role="toolbar">
                    <label htmlFor="file" className="fileContainer btn btn-primary btn-sm">
                        Load Analysis
                        <input
                            type="file"
                            id="file"
                            onChange={e => mainStore.loadAnalysis(e.target.files[0])}
                        />
                    </label>
                    <button
                        type="button"
                        className="btn btn-primary btn-sm mr-1"
                        onClick={() => mainStore.saveAnalysis()}
                        disabled={!mainStore.isValid}>
                        Save Analysis
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={!mainStore.isReadyToExecute}
                        onClick={() => mainStore.executeAnalysis()}>
                        Run Analysis
                    </button>
                </div>
                {mainStore.isExecuting ? <Spinner text="Executing, please wait..." /> : null}
                {mainStore.errorMessage ? (
                    <div className="alert alert-danger">{mainStore.errorMessage}</div>
                ) : null}

                <div>
                    <p>Steps Required: </p>
                    <p style={{float:"left"}}>1. Select a Model</p>{mainStore.isModelSelected?<p>&#9989;</p>:<p>&#10060;</p>}
                    <p style={{float:"left"}}>1. Select a Dataset</p>{mainStore.isDatasetSelected?<p>&#9989;</p>:<p>&#10060;</p>}
                    <p style={{float:"left"}}>1. Select a Option set</p>{mainStore.isOptionSelected?<p>&#9989;</p>:<p>&#10060;</p>}
                </div>

            </form>
        );
    }
}
AnalysisForm.propTypes = {
    mainStore: PropTypes.object,
    getEditSettings: PropTypes.func,
    analysis_name: PropTypes.string,
    changeAnalysisName: PropTypes.func,
    analysis_description: PropTypes.string,
    changeAnalysisDescription: PropTypes.func,
    changeDatasetType: PropTypes.func,
    dataset_type: PropTypes.string,
    getModelTypes: PropTypes.func,
    saveAnalysis: PropTypes.func,
    isReadyToExecute: PropTypes.bool,
    executeAnalysis: PropTypes.func,
    isExecuting: PropTypes.bool,
};
export default AnalysisForm;
