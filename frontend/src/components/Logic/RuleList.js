import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import {toJS} from "mobx";
import Rule from "./Rule";
import RuleReadOnly from "./RuleReadOnly";
import {headers, ruleOrder, disabled_properties, long_name} from "../../constants/logicConstants";

@inject("logicStore")
@observer
class RuleList extends Component {
    render() {
        const {logicStore} = this.props;
        let rules = toJS(logicStore.logic.rules);

        return (
            <div className="row">
                <div className="col">
                    <table className="table table-bordered">
                        <thead className="table-primary">
                            <tr>
                                <th colSpan="7" className="text-center">
                                    Model Recommendation/Bin Placement Logic
                                </th>
                            </tr>
                            <tr>
                                {headers.map((item, i) => {
                                    return (
                                        <th key={i} className="text-center">
                                            {item}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        {logicStore.getEditSettings ? (
                            <tbody>
                                {ruleOrder.map(ruleName => {
                                    const rule = rules[ruleName];
                                    return (
                                        <Rule
                                            key={ruleName}
                                            rule={rule}
                                            rule_name={ruleName}
                                            long_name={long_name[ruleName].name}
                                            notes={long_name[ruleName].notes}
                                            changeLogicValues={logicStore.changeLogicValues}
                                            disableList={disabled_properties}
                                        />
                                    );
                                })}
                            </tbody>
                        ) : (
                            <tbody>
                                {ruleOrder.map(ruleName => {
                                    const rule = rules[ruleName];
                                    return (
                                        <RuleReadOnly
                                            key={ruleName}
                                            rule={rule}
                                            rule_name={ruleName}
                                            long_name={long_name[ruleName].name}
                                            notes={long_name[ruleName].notes}
                                        />
                                    );
                                })}
                            </tbody>
                        )}
                    </table>
                </div>
            </div>
        );
    }
}

RuleList.propTypes = {
    logicStore: PropTypes.object,
    getModelRecommendationHeaders: PropTypes.func,
    getModelRecommendationList: PropTypes.func,
    toggleTest: PropTypes.func,
};

export default RuleList;
