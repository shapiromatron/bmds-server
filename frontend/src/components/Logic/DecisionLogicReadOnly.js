import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import {decision_logic} from "../../constants/logicConstants";
import {readOnlyCheckbox} from "../../common";

@inject("logicStore")
@observer
class DecisionLogic extends Component {
    render() {
        const {logicStore} = this.props;
        return (
            <div>
                <div className="row mt-2">
                    <div className="col-lg-6">
                        <table className="table table-bordered table-sm">
                            <thead>
                                <tr className="table-primary">
                                    <th colSpan="2">Decision-Logic</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{decision_logic.recommend_viable}</td>
                                    <td className="text-center" style={{minWidth: 50}}>
                                        {readOnlyCheckbox(logicStore.logic.recommend_viable)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>{decision_logic.recommend_questionable}</td>
                                    <td className="text-center">
                                        {readOnlyCheckbox(logicStore.logic.recommend_questionable)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>{decision_logic.sufficiently_close_bmdl}</td>
                                    <td className="text-center">
                                        {logicStore.logic.sufficiently_close_bmdl}
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
