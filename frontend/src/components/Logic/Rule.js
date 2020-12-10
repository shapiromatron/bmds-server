import React from "react";
import PropTypes from "prop-types";

const Rule = props => {
    return (
        <tr>
            <td>{props.long_name}</td>
            <td className="text-center">
                <input
                    type="checkbox"
                    id="enabled_continuous"
                    name={props.rule_name}
                    checked={props.rule.enabled_continuous}
                    onChange={e =>
                        props.changeLogicValues(
                            props.rule_name,
                            "enabled_continuous",
                            e.target.checked
                        )
                    }
                    disabled={props.disableList.includes(props.rule_name + "-continuous")}
                />
            </td>
            <td className="text-center">
                <input
                    type="checkbox"
                    id="dichotomous-checkbox"
                    checked={props.rule.enabled_dichotomous}
                    onChange={e =>
                        props.changeLogicValues(
                            props.rule_name,
                            "enabled_dichotomous",
                            e.target.checked
                        )
                    }
                    disabled={props.disableList.includes(props.rule_name + "-dichotomous")}
                />
            </td>
            <td className="text-center">
                <input
                    type="checkbox"
                    id="nested-checkbox"
                    checked={props.rule.enabled_nested}
                    onChange={e =>
                        props.changeLogicValues(props.rule_name, "enabled_nested", e.target.checked)
                    }
                    disabled={props.disableList.includes(props.rule_name + "-nested")}
                />
            </td>
            <td className="text-center">
                <input
                    className="text-center form-control"
                    type="number"
                    value={props.rule.threshold}
                    onChange={e =>
                        props.changeLogicValues(
                            props.rule_name,
                            "threshold",
                            parseFloat(e.target.value)
                        )
                    }
                    disabled={props.disableList.includes(props.rule_name + "-threshold")}
                />
            </td>
            <td className="text-center">
                <select
                    className="form-control bin_failure"
                    value={props.rule.failure_bin}
                    onChange={e =>
                        props.changeLogicValues(
                            props.rule_name,
                            "failure_bin",
                            parseInt(e.target.value)
                        )
                    }
                    disabled={props.disableList.includes(props.rule_name + "-failure_bin")}>
                    <option value="2">Unusable Bin</option>
                    <option value="1">No Bin-Change (warning)</option>
                    <option value="0">Questionable Bin</option>
                </select>
            </td>
            <td className="text-center">
                {props.notes !== undefined ? (
                    props.notes(props.rule.threshold)
                ) : (
                    <p>{props.notes}</p>
                )}
            </td>
        </tr>
    );
};
Rule.propTypes = {
    rule: PropTypes.object,
    rule_name: PropTypes.string,
    long_name: PropTypes.string,
    notes: PropTypes.func,
    disableList: PropTypes.array,
    changeLogicValues: PropTypes.func,
};
export default Rule;
