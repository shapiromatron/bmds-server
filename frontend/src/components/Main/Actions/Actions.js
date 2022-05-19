import _ from "lodash";
import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import Button from "../../common/Button";

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
                <Button
                    text="Actions&nbsp;"
                    className="btn btn-primary dropdown-toggle"
                    type="button"
                    id="bmdSessionActions"
                    dataToggle="dropdown"
                    hasPopup={true}
                />
                <div
                    className="dropdown-menu dropdown-menu-right"
                    style={{minWidth: 360}}
                    aria-labelledby="bmdSessionActions">
                    {mainStore.canEdit ? (
                        <>
                            <span className="dropdown-header">Edit settings</span>
                            <div className="dropdown-item form-group mb-0">
                                <label
                                    htmlFor="loadAnalysisFile"
                                    className="mb-0"
                                    style={{
                                        fontWeight: "normal",
                                        cursor: "pointer",
                                        display: "block",
                                    }}>
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
                                    <p className="text-muted pl-4 mb-0">
                                        <b>Deletion date:</b>&nbsp;
                                        {getDeletionDateText(config.editSettings)}
                                    </p>
                                </>
                            ) : null}
                            <a className="dropdown-item" href={config.editSettings.deleteUrl}>
                                <i className="fa fa-fw fa-trash"></i>
                                &nbsp;Delete analysis
                            </a>
                            <div className="dropdown-divider"></div>
                        </>
                    ) : null}
                    <span className="dropdown-header">Reporting</span>
                    {mainStore.analysisSavedAndValidated && mainStore.hasOutputs ? (
                        <>
                            <Button
                                className="dropdown-item"
                                onClick={() => mainStore.downloadReport("excelUrl")}
                                faClass="fa fa-fw fa-file-excel-o"
                                text="Download data"
                            />
                            <Button
                                className="dropdown-item"
                                onClick={mainStore.showWordReportOptionModal}
                                faClass="fa fa-fw fa-file-word-o"
                                text="Download report"
                            />
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
                    ) : (
                        <p className="text-muted pl-4 mb-0">Please save and execute analysis.</p>
                    )}
                </div>
            </div>
        );
    }
}
Actions.propTypes = {
    mainStore: PropTypes.object,
};
export default Actions;
