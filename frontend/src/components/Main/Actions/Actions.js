import _ from "lodash";
import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

const getDeletionDateText = function(editSettings) {
    const date = editSettings.deleteDateStr,
        days = editSettings.deletionDaysUntilDeletion;
    return `${date} (${days} days)`;
};

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
                    style={{minWidth: 360}}
                    aria-labelledby="bmdSessionActions">
                    {mainStore.canEdit ? (
                        <>
                            <h6 className="dropdown-header">Edit settings</h6>
                            <div className="dropdown-item form-group mb-0">
                                <label
                                    htmlFor="loadAnalysisFile"
                                    className="mb-0"
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
                            {_.isNumber(config.editSettings.deletionDaysUntilDeletion) ? (
                                <>
                                    <a
                                        className="dropdown-item"
                                        href={config.editSettings.renewUrl}>
                                        <i className="fa fa-fw fa-calendar"></i>
                                        &nbsp;Extend deletion date
                                    </a>
                                    <p className="text-muted pl-4">
                                        <b>Deletion date:</b>&nbsp;
                                        {getDeletionDateText(config.editSettings)}
                                    </p>
                                </>
                            ) : null}

                            <div className="dropdown-divider"></div>
                        </>
                    ) : null}
                    {mainStore.hasOutputs ? (
                        <>
                            <h6 className="dropdown-header">Reporting</h6>
                            <button
                                className="dropdown-item"
                                type="button"
                                onClick={() => mainStore.downloadReport("excelUrl")}>
                                <i className="fa fa-fw fa-file-excel-o"></i>
                                &nbsp;Download data
                            </button>
                            <button
                                className="dropdown-item"
                                type="button"
                                onClick={() => mainStore.downloadReport("wordUrl")}>
                                <i className="fa fa-fw fa-file-word-o"></i>
                                &nbsp;Download report
                            </button>
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
