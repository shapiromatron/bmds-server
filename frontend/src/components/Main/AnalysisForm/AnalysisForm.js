import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import AnalysisFormReadOnly from "./AnalysisFormReadOnly";
import PropTypes from "prop-types";

@inject("mainStore")
@observer
class AnalysisForm extends Component {
    render() {
        const {mainStore} = this.props;
        return (
            <div>
                {mainStore.getEditSettings ? (
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
                                className="form-control"
                                onChange={e => mainStore.changeDatasetType(e.target.value)}
                                value={mainStore.dataset_type}>
                                {mainStore.getModelTypes.map((item, i) => {
                                    return [
                                        <option key={i} value={item.value}>
                                            {item.name}
                                        </option>,
                                    ];
                                })}
                            </select>
                        </div>
                        <div className="btn-toolbar btn-group form-group" role="toolbar">
                            <button type="button" className="btn btn-primary btn-sm mr-1">
                                Load Analysis
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary btn-sm mr-1"
                                onClick={() => mainStore.saveAnalysis()}>
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

                        {mainStore.isExecuting ? <p>Executing... please wait....</p> : null}
                    </form>
                ) : (
                    <AnalysisFormReadOnly />
                )}
            </div>
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
