import _ from "lodash";
import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {readOnlyCheckbox} from "../../common";
import {BIN_NAMES, BINS, ruleLookups} from "../../constants/logicConstants";

@observer
class RuleRow extends Component {
    render() {
        const {rule, ruleIndex, canEdit, updateRule} = this.props,
            ruleLookup = ruleLookups[rule.rule_class],
            renderCheckbox = attribute => {
                return (
                    <input
                        type="checkbox"
                        checked={rule[attribute]}
                        onChange={e => updateRule(ruleIndex, attribute, e.target.checked)}
                    />
                );
            };

        return canEdit ? (
            <tr>
                <td>{ruleLookup.name}</td>
                <td>{ruleLookup.enabledContinuous ? renderCheckbox("enabled_continuous") : "-"}</td>
                <td>
                    {ruleLookup.enabledDichotomous ? renderCheckbox("enabled_dichotomous") : "-"}
                </td>
                <td>{ruleLookup.enabledNested ? renderCheckbox("enabled_nested") : "-"}</td>
                <td>
                    {ruleLookup.hasThreshold ? (
                        <input
                            className="form-control form-control-sm"
                            type="number"
                            value={rule.threshold}
                            onChange={e =>
                                updateRule(ruleIndex, "threshold", parseFloat(e.target.value))
                            }
                        />
                    ) : (
                        "N/A"
                    )}
                </td>
                <td>
                    <select
                        className="form-control form-control-sm"
                        value={rule.failure_bin}
                        onChange={e =>
                            updateRule(ruleIndex, "failure_bin", parseInt(e.target.value))
                        }>
                        <option value={BINS.NO_CHANGE}>No Bin-Change (warning)</option>
                        <option value={BINS.WARNING}>Questionable Bin</option>
                        <option value={BINS.FAILURE}>Unusable Bin</option>
                    </select>
                </td>
                <td>{ruleLookup.notes(rule.threshold)}</td>
            </tr>
        ) : (
            <tr>
                <td>{ruleLookup.name}</td>
                <td className="text-center">
                    {ruleLookup.enabledContinuous ? readOnlyCheckbox(rule.enabled_continuous) : "-"}
                </td>
                <td className="text-center">
                    {ruleLookup.enabledDichotomous
                        ? readOnlyCheckbox(rule.enabled_dichotomous)
                        : "-"}
                </td>
                <td className="text-center">
                    {ruleLookup.enabledNested ? readOnlyCheckbox(rule.enabled_nested) : "-"}
                </td>
                <td>{_.isNumber(rule.threshold) ? rule.threshold : "-"}</td>
                <td>{BIN_NAMES[rule.failure_bin]}</td>
                <td>{ruleLookup.notes(rule.threshold)}</td>
            </tr>
        );
    }
}

RuleRow.propTypes = {
    rule: PropTypes.object.isRequired,
    ruleIndex: PropTypes.number.isRequired,
    canEdit: PropTypes.bool.isRequired,
    updateRule: PropTypes.func.isRequired,
};

export default RuleRow;
