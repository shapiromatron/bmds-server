import React from "react";
import PropTypes from "prop-types";

const Rule = props => {
    return (
        <thead>
            {Object.keys(props.rules).map((rule, i) => {
                return (
                    <tr key={i}>
                        <td>{props.long_name[rule].name}</td>
                        <td className="text-center">
                            <input
                                type="checkbox"
                                checked={props.rules[rule].enabled_continuous}
                                onChange={e =>
                                    props.toggleTest(rule, "enabled_continuous", e.target.checked)
                                }
                                disabled={props.disableList.includes(rule + "-continuous")}
                            />
                        </td>
                        <td className="text-center">
                            <input
                                type="checkbox"
                                checked={props.rules[rule].enabled_dichotomous}
                                onChange={e =>
                                    props.toggleTest(rule, "enabled_dichotomous", e.target.checked)
                                }
                                disabled={props.disableList.includes(rule + "-dichotomous")}
                            />
                        </td>
                        <td className="text-center">
                            <input
                                type="checkbox"
                                checked={props.rules[rule].enabled_nested}
                                onChange={e =>
                                    props.toggleTest(rule, "enabled_nested", e.target.checked)
                                }
                                disabled={props.disableList.includes(rule + "-nested")}
                            />
                        </td>
                        <td className="text-center">
                            <input
                                className="text-center"
                                type="number"
                                value={props.rules[rule].threshold}
                                onChange={e =>
                                    props.changeThreshold(rule, parseFloat(e.target.value))
                                }
                                disabled={props.disableList.includes(rule + "-threshold")}
                            />
                        </td>
                        <td className="text-center">
                            <select
                                value={props.rules[rule].failure_bin}
                                onChange={e => props.changeBinType(rule, parseInt(e.target.value))}
                                disabled={props.disableList.includes(rule + "-failure_bin")}>
                                <option value="2">Unusable Bin</option>
                                <option value="1">No Bin-Change (warning)</option>
                                <option value="0">Questionable Bin</option>
                            </select>
                        </td>
                        <td>
                            {props.long_name[rule].note1}
                            {props.rules[rule].threshold}
                            {props.long_name[rule].note2}
                        </td>
                    </tr>
                );
            })}
        </thead>
    );
};
Rule.propTypes = {
    rules: PropTypes.object,
    long_name: PropTypes.object,
    toggleTest: PropTypes.func,
    disableList: PropTypes.array,
    changeBinType: PropTypes.func,
    changeThreshold: PropTypes.func,
};
export default Rule;
