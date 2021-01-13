import _ from "lodash";
import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

import RuleRow from "./RuleRow";
import {ruleOrder} from "../../constants/logicConstants";

@inject("logicStore")
@observer
class RuleList extends Component {
    render() {
        const {logicStore} = this.props,
            {canEdit, updateRule} = logicStore,
            {rules} = logicStore.logic;

        return (
            <table className="table table-bordered">
                <thead className="table-primary">
                    <tr>
                        <th colSpan="7" className="text-center">
                            Model Recommendation/Bin Placement Logic
                        </th>
                    </tr>
                    <tr>
                        <th>Test Description</th>
                        <th>Continuous</th>
                        <th>Dichotomous</th>
                        <th>Nested</th>
                        <th>Test Threshold</th>
                        <th>Bin Placement if Test is Failed</th>
                        <th>Notes to Show</th>
                    </tr>
                </thead>
                <tbody>
                    {ruleOrder.map(ruleName => {
                        const ruleIndex = _.findIndex(rules, d => d.rule_class === ruleName);
                        return (
                            <RuleRow
                                key={ruleName}
                                rule={rules[ruleIndex]}
                                ruleIndex={ruleIndex}
                                canEdit={canEdit}
                                updateRule={updateRule}
                            />
                        );
                    })}
                </tbody>
            </table>
        );
    }
}

RuleList.propTypes = {
    logicStore: PropTypes.object,
};

export default RuleList;
