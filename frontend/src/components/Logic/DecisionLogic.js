import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import {decision_logic} from "../../constants/logicConstants";

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
                    <div className="col col-xs-12 col-md-3 table-responsive">
                        <table className="table table-bordered table-sm decision-logic">
                            <thead>
                                <tr className="table-primary">
                                    <th colSpan="2">Decision-Logic</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{decision_logic.recommend_viable}</td>
                                    <td className="text-center">
                                        <input
                                            type="checkbox"
                                            id="recommend_viable"
                                            onChange={e =>
                                                logicStore.changeDecisionLogicValues(
                                                    "recommend_viable",
                                                    e.target.checked
                                                )
                                            }
                                            checked={logicStore.logic.recommend_viable}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>{decision_logic.recommend_questionable}</td>
                                    <td className="text-center">
                                        <input
                                            type="checkbox"
                                            onChange={e =>
                                                logicStore.changeDecisionLogicValues(
                                                    "recommend_questionable",
                                                    e.target.checked
                                                )
                                            }
                                            checked={logicStore.logic.recommend_questionable}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>{decision_logic.sufficiently_close_bmdl}</td>
                                    <td className="text-center">
                                        <input
                                            className=" text-center form-control"
                                            type="number"
                                            id="sufficiently_close_bmdl"
                                            value={logicStore.logic.sufficiently_close_bmdl}
                                            onChange={e =>
                                                logicStore.changeDecisionLogicValues(
                                                    "sufficiently_close_bmdl",
                                                    parseInt(e.target.value)
                                                )
                                            }
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
