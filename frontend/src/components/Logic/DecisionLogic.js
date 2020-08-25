import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("logicStore")
@observer
class DecisionLogic extends Component {
    render() {
        const {logicStore} = this.props;
        return (
            <div>
                <div className="row">
                    <div className="col col-xs-12 col-md-2">
                        <button
                            className="btn btn-info"
                            onClick={e => logicStore.setDefaultState()}>
                            Reset to Default Logic
                        </button>
                    </div>
                </div>

                <div className="row">
                    <div className="col col-xs-12 col-sm-3">
                        <table className="table table-bordered table-sm decision-logic">
                            <thead>
                                <tr className="table-primary">
                                    <th colSpan="2">Decision-Logic</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{logicStore.getDecisionLogic.recommend_viable}</td>
                                    <td>
                                        <select
                                            className="form-control"
                                            name="recommend_viable"
                                            onChange={e => logicStore.changeDecisionLogic(e)}
                                            value={logicStore.logic.recommend_viable}>
                                            <option value="true">True</option>
                                            <option value="false">False</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>{logicStore.getDecisionLogic.recommend_questionable}</td>
                                    <td>
                                        <select
                                            className="form-control"
                                            name="recommend_questionable"
                                            onChange={e => logicStore.changeDecisionLogic(e)}
                                            value={logicStore.logic.recommend_questionable}>
                                            <option value="true">True</option>
                                            <option value="false">False</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>{logicStore.getDecisionLogic.sufficiently_close_bmdl}</td>
                                    <td>
                                        <input
                                            className="form-control text-center"
                                            type="number"
                                            name="sufficiently_close_bmdl"
                                            value={logicStore.logic.sufficiently_close_bmdl}
                                            onChange={e => logicStore.changeCloseBMDL(e)}
                                        />
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
    setDefaultState: PropTypes.func,
    getDecisionLogic: PropTypes.func,
    logic: PropTypes.object,
};
export default DecisionLogic;
