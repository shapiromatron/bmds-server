import React from "react";

const InputForm = props => {
    return (
        <tr key={props.idx}>
            {props.form.map(item => {
                return [
                    <td key={props.idx}>
                        <input name={item.name} id={props.idx} onChange={props.onChange}></input>
                    </td>,
                ];
            })}
            <td>
                <button
                    className="btn btn-danger close"
                    aria-label="Close"
                    onClick={e => props.delete(e, props.idx)}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </td>
        </tr>
    );
};

export default InputForm;
