import _ from "lodash";
import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {checkOrEmpty} from "../../common";
import {BIN_NAMES, ruleLookups, logicBinOptions} from "../../constants/logicConstants";
import SelectInput from "../common/SelectInput";
import FloatInput from "../common/FloatInput";
import CheckboxInput from "../common/CheckboxInput";

@observer
class RuleRow extends Component {
    render() {
        const {rule, ruleIndex, canEdit, updateRule} = this.props,
            ruleLookup = ruleLookups[rule.rule_class],
            renderCheckbox = attribute => {
                return (
                    <CheckboxInput
                        checked={rule[attribute]}
                        onChange={value => updateRule(ruleIndex, attribute, value)}
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
                        <FloatInput
                            name={rule.rule_class}
                            id={ruleIndex}
                            value={rule.threshold}
                            onChange={value => updateRule(ruleIndex, "threshold", value)}
                        />
                    ) : (
                        "N/A"
                    )}
                </td>
                <td>
                    <SelectInput
                        choices={logicBinOptions.map(option => {
                            return {value: option.value, text: option.label};
                        })}
                        onChange={value => updateRule(ruleIndex, "failure_bin", value)}
                        value={rule.failure_bin}
                    />
                </td>
                <td>{ruleLookup.notes(rule.threshold)}</td>
            </tr>
        ) : (
            <tr>
                <td>{ruleLookup.name}</td>
                <td className="text-center">
                    {ruleLookup.enabledContinuous ? checkOrEmpty(rule.enabled_continuous) : "-"}
                </td>
                <td className="text-center">
                    {ruleLookup.enabledDichotomous ? checkOrEmpty(rule.enabled_dichotomous) : "-"}
                </td>
                <td className="text-center">
                    {ruleLookup.enabledNested ? checkOrEmpty(rule.enabled_nested) : "-"}
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
