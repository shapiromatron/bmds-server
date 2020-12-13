import React from "react";
import PropTypes from "prop-types";

const Rule = props => {
    return (
        <tr>
            <td>{props.long_name}</td>
            <td className="text-center">
                {props.rule.enabled_continuous ? (
                    <i className="fa fa-check-square-o"></i>
                ) : (
                    <i className="fa fa-square-o"></i>
                )}
            </td>
            <td className="text-center">
                {props.rule.enabled_dichotomous ? (
                    <i className="fa fa-check-square-o"></i>
                ) : (
                    <i className="fa fa-square-o"></i>
                )}
            </td>
            <td className="text-center">
                {props.rule.enabled_nested ? (
                    <i className="fa fa-check-square-o"></i>
                ) : (
                    <i className="fa fa-square-o"></i>
                )}
            </td>
            <td className="text-center">{props.rule.threshold}</td>
            <td className="text-center">{props.rule.failure_bin}</td>
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
