import React from "react";

const OptionsReadOnly = props => {
    return (
        <tr>
            <td>{props.idx}</td>
            {Object.keys(props.item).map((val, index) => {
                return [<td key={index}>{props.item[val]}</td>];
            })}
        </tr>
    );
};
export default OptionsReadOnly;
