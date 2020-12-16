import React from "react";
import PropTypes from "prop-types";

import {BIN_NAMES} from "../../constants/logicConstants";
import {readOnlyCheckbox} from "../../common";

const Rule = props => {
    return (
        <tr>
            <td>{props.long_name}</td>
            <td className="text-center">{readOnlyCheckbox(props.rule.enabled_continuous)}</td>
            <td className="text-center">{readOnlyCheckbox(props.rule.enabled_dichotomous)}</td>
            <td className="text-center">{readOnlyCheckbox(props.rule.enabled_nested)}</td>
            <td>{props.rule.threshold}</td>
            <td>{BIN_NAMES[props.rule.failure_bin]}</td>
            <td>
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
