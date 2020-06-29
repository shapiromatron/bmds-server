import React from "react";

const InputForm = props => {
    return (
        <tr>
            {Object.keys(props.row).map((key, index) => {
                return [
                    <td key={index}>
                        <input
                            type="number"
                            name={key}
                            value={props.row[key]}
                            onChange={e => props.onChange(e, props.dataset_id, props.idx)}
                        />
                    </td>,
                ];
            })}
            <td>
                <button
                    className="btn btn-danger btn-sq-xs"
                    onClick={e => props.delete(e, props.dataset_id, props.idx)}>
                    <i className="fa fa-trash fa-1x"></i>
                </button>
            </td>
        </tr>
    );
};
export default InputForm;
