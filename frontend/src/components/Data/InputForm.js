import React from "react";

const InputForm = props => {
    return (
        <tr key={props.idx}>
            <td>
                <input name="doses" id={props.idx} onChange={props.onChange}></input>
            </td>
            <td>
                <input name="ns" id={props.idx} onChange={props.onChange}></input>
            </td>
            {props.form_type === "D" ? (
                <td>
                    <input name="incidences" id={props.idx} onChange={props.onChange}></input>
                </td>
            ) : null}
            {props.form_type === "CS" ? (
                <td>
                    <input name="means" id={props.idx} onChange={props.onChange}></input>
                </td>
            ) : null}
            {props.form_type === "CS" ? (
                <td>
                    <input name="stdevs" id={props.idx} onChange={props.onChange}></input>
                </td>
            ) : null}
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
