import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("mainStore")
@observer
class Actions extends Component {
    render() {
        const {mainStore} = this.props,
            {config} = mainStore;
        return (
            <div className="dropdown">
                <button
                    className="btn btn-info dropdown-toggle"
                    type="button"
                    id="bmdSessionActions"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                    Actions
                </button>
                <div
                    className="dropdown-menu dropdown-menu-right"
                    aria-labelledby="bmdSessionActions">
                    {mainStore.canEdit ? (
                        <>
                            <h6 className="dropdown-header">Edit settings</h6>
                            <div className="dropdown-item form-group">
                                <label
                                    htmlFor="loadAnalysisFile"
                                    style={{fontWeight: "normal", cursor: "pointer"}}>
                                    <i className="fa fa-fw fa-upload"></i>
                                    &nbsp;Load analysis
                                </label>
                                <input
                                    id="loadAnalysisFile"
                                    type="file"
                                    className="hiddenInputFile"
                                    onChange={e => {
                                        mainStore.loadAnalysisFromFile(e.target.files[0]);
                                        e.target.value = "";
                                    }}
                                />
                            </div>
                        </>
                    ) : null}
                    {mainStore.hasOutputs ? (
                        <>
                            <h6 className="dropdown-header">Reporting</h6>
                            <a className="dropdown-item" href={config.excelUrl}>
                                <i className="fa fa-fw fa-file-excel-o"></i>
                                &nbsp;Download data
                            </a>
                            <a className="dropdown-item" href={config.wordUrl}>
                                <i className="fa fa-fw fa-file-word-o"></i>
                                &nbsp;Download report
                            </a>
                            <a
                                className="dropdown-item"
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    mainStore.saveAnalysisToFile();
                                }}>
                                <i className="fa fa-fw fa-download"></i>
                                &nbsp;Download analysis
                            </a>
                        </>
                    ) : null}
                </div>
            </div>
        );
    }
}
Actions.propTypes = {
    mainStore: PropTypes.object,
};
export default Actions;
