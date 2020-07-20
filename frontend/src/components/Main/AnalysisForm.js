import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import AnalysisFormReadOnly from "./AnalysisFormReadOnly";

@inject("mainStore")
@observer
class AnalysisForm extends Component {
    render() {
        const {mainStore} = this.props,
            handleSubmit = e => {
                e.preventDefault();
                mainStore.saveAnalysis();
            },
            handleChange = e => {
                mainStore.addanalysisForm(e.target.name, e.target.value);
            },
            isEditSettings = mainStore.getEditSettings();

        return (
            <div>
                {isEditSettings ? (
                    <form onSubmit={handleSubmit} className="analysis-form table-primary ">
                        <div className="form-group">
                            <label>Analysis Name</label>
                            <input
                                className="form-control"
                                type="text"
                                name="analysis_name"
                                value={mainStore.analysisForm.analysis_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Analysis Description</label>
                            <textarea
                                className="form-control"
                                type="textarea"
                                rows="3"
                                name="analysis_description"
                                value={mainStore.analysisForm.analysis_description}
                                onChange={handleChange}></textarea>
                        </div>
                        <div className="form-group">
                            <label>Select Model Type</label>
                            <select
                                className="form-control"
                                name="dataset_type"
                                onChange={handleChange}
                                value={mainStore.analysisForm.dataset_type}>
                                {mainStore.modelTypes.map((item, i) => {
                                    return [
                                        <option key={i} value={item.value}>
                                            {item.name}
                                        </option>,
                                    ];
                                })}
                            </select>
                        </div>
                        <div className="btngroup form-group" role="toolbar">
                            <button type="button" className="btn btn-primary  mr-1">
                                Load Analysis
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary  mr-1"
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

                        {mainStore.isExecuting ? <p>Executing... please wait....</p> : null}
                    </form>
                ) : (
                    <AnalysisFormReadOnly />
                )}
            </div>
        );
    }
}

export default AnalysisForm;
