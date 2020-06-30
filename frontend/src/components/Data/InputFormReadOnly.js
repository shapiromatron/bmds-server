import React from "react";

const InputFormReadOnly = props => {
    return (
        <tr>
            {Object.keys(props.row).map((key, index) => {
                return [
                    <td key={index}>
                        <p>{props.row[key]}</p>
                    </td>,
                ];
            })}
        </tr>
    );
};
export default InputFormReadOnly;
