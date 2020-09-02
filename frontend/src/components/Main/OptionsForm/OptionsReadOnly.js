import React from "react";
import PropTypes from "prop-types";

const OptionsReadOnly = props => {
    return (
        <tr>
            <td>{props.idx}</td>
            {Object.keys(props.options).map((val, index) => {
                return <td key={index}>{props.options[val]}</td>;
            })}
        </tr>
    );
};
OptionsReadOnly.propTypes = {
    idx: PropTypes.number,
    options: PropTypes.object,
};
export default OptionsReadOnly;
