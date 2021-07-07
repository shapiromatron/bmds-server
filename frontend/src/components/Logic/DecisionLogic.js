import _ from "lodash";
import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import {checkOrEmpty} from "../../common";

@inject("logicStore")
@observer
class DecisionLogic extends Component {
    render() {
        const {logicStore} = this.props,
            {canEdit, resetLogic, updateLogic, logic} = logicStore,
            renderBooleanRow = (label, field) => {
                return (
                    <tr>
                        <td>{label}</td>
                        <td className="text-center" style={{minWidth: 50}}>
                            {canEdit ? (
                                <input
                                    type="checkbox"
                                    onChange={e => updateLogic(field, e.target.checked)}
                                    checked={logic[field]}
                                />
                            ) : (
                                checkOrEmpty(logic[field])
                            )}
                        </td>
                    </tr>
                );
            };

        return (
            <div>
                {canEdit ? (
                    <div className="row">
                        <div className="col col-md-6">
                            <button className="btn btn-info btn-sm" onClick={() => resetLogic()}>
                                Reset to Default Logic
                            </button>
                        </div>
                    </div>
                ) : null}
                <div className="row mt-2">
                    <div className="col col-lg-6">
                        <table className="table table-bordered table-sm">
                            <thead>
                                <tr className="table-primary">
                                    <th colSpan="2">Decision-Logic</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderBooleanRow("Enabled", "enabled")}
                                {renderBooleanRow(
                                    "Recommend model in Viable Bin",
                                    "recommend_viable"
                                )}
                                {renderBooleanRow(
                                    "Recommend model in Questionable Bin",
                                    "recommend_questionable"
                                )}
                                <tr>
                                    <td>
                                        Maximum BMDL range deemed &ldquo;sufficiently close&rdquo;
                                        <br />
                                        to use lowest AIC instead of lowest BMDL in viable models
                                    </td>
                                    <td className="text-center">
                                        {canEdit ? (
                                            <input
                                                className=" text-center form-control p-0"
                                                type="number"
                                                id="sufficiently_close_bmdl"
                                                value={logic.sufficiently_close_bmdl}
                                                onChange={e => {
                                                    const value = parseFloat(e.target.value);
                                                    if (_.isNumber(value)) {
                                                        updateLogic(
                                                            "sufficiently_close_bmdl",
                                                            parseFloat(e.target.value)
                                                        );
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <span>{logic.sufficiently_close_bmdl}</span>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

DecisionLogic.propTypes = {
    logicStore: PropTypes.object,
};

export default DecisionLogic;
