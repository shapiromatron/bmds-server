import React from "react";
import PropTypes from "prop-types";
const InputForm = props => {
    return (
        <tr>
            {Object.keys(props.row).map((key, index) => {
                return (
                    <td key={index} className="inputform">
                        <input
                            type="number"
                            name={key}
                            value={props.row[key]}
                            onChange={e =>
                                props.onChange(key, e.target.value, props.dataset_id, props.idx)
                            }
                        />
                    </td>
                );
            })}
            <td>
                <button
                    className="btn btn-danger btn-sq-xs"
                    onClick={e => props.delete(props.dataset_id, props.idx)}>
                    <i className="fa fa-trash fa-1x"></i>
                </button>
            </td>
        </tr>
    );
};
InputForm.propTypes = {
    row: PropTypes.object,
    onChange: PropTypes.func,
    dataset_id: PropTypes.number,
    idx: PropTypes.number,
    delete: PropTypes.func,
};
export default InputForm;
