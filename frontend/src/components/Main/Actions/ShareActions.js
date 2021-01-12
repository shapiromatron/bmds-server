import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

import ClipboardButton from "../../common/ClipboardButton";

@inject("mainStore")
@observer
class ShareActions extends Component {
    render() {
        const {editSettings} = this.props.mainStore.config;
        return (
            <div className="dropdown">
                <button
                    className="btn btn-success dropdown-toggle"
                    type="button"
                    id="bmdSessionShare"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                    Share
                </button>
                <div
                    style={{minWidth: 300}}
                    className="dropdown-menu dropdown-menu-right"
                    aria-labelledby="bmdSessionShare">
                    <form className="px-3">
                        <p className="text-muted py-2">
                            Analyses are kept for six months; current deletion date:
                            <br />
                            <b>{editSettings.deleteDateStr}</b>
                        </p>
                        <div className="form-group">
                            <label>Read-only link</label>
                            <div
                                className="btn-group btn-block"
                                role="group"
                                aria-label="Basic example">
                                <ClipboardButton
                                    text="Copy link"
                                    textToCopy={editSettings.viewUrl}
                                    className="btn btn-secondary mr-1"
                                />
                                <a
                                    href={editSettings.viewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary">
                                    <i className="fa fa-fw fa-external-link"></i>
                                    &nbsp;Open
                                </a>
                            </div>
                            <p className="text-muted">
                                Anyone with this link can view the analysis, download reports, but
                                not edit it.
                            </p>
                        </div>
                        <div className="form-group">
                            <label>Edit link</label>
                            <div
                                className="btn-group btn-block"
                                role="group"
                                aria-label="Basic example">
                                <ClipboardButton
                                    text="Copy link"
                                    textToCopy={editSettings.editUrl}
                                    className="btn btn-warning mr-1"
                                />
                                <a
                                    href={editSettings.editUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-warning">
                                    <i className="fa fa-fw fa-external-link"></i>
                                    &nbsp;Open
                                </a>
                            </div>
                            <p className="text-muted">
                                Anyone with this link can edit the analysis.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
ShareActions.propTypes = {
    mainStore: PropTypes.object,
};
export default ShareActions;
