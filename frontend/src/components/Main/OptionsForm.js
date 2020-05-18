import React from "react";

const OptionsForm = props => {
    return (
        <tr>
            <td>{props.idx}</td>
            {props.dataset_type === "C" ? (
                <td>
                    <select
                        name="bmr_type"
                        className="form-control"
                        value={props.item.bmr_type}
                        id={props.idx}
                        onChange={props.onchange}>
                        <option>Select</option>
                        <option value="Std. Dev.">Std. Dev.</option>
                        <option value="Rel. Dev.">Rel. Dev.</option>
                        <option value="Abs. Dev.">Abs. Dev.</option>
                        <option value="Point">Point</option>
                        <option value="Hybrid Extra Risk">Hybrid- extra risk</option>
                    </select>
                </td>
            ) : null}
            {props.dataset_type === "D" ? (
                <td>
                    <select
                        name="bmr_type"
                        className="form-control"
                        value={props.item.bmr_type}
                        id={props.idx}
                        onChange={props.onchange}>
                        <option>Select</option>
                        <option value="Extra">Extra Risk</option>
                        <option value="Added">Added Risk</option>
                    </select>
                </td>
            ) : null}

            <td>
                <input
                    type="text"
                    name="bmr_value"
                    value={props.item.bmr_value}
                    id={props.idx}
                    className="form-control "
                    onChange={props.onchange}
                />
            </td>
            {props.dataset_type === "C" ? (
                <td>
                    <input
                        type="text"
                        name="tail_probability"
                        value={props.item.tail_probability}
                        id={props.idx}
                        className="form-control "
                        onChange={props.onchange}
                    />
                </td>
            ) : null}
            <td>
                <input
                    type="text"
                    name="confidence_level"
                    value={props.item.confidence_level}
                    id={props.idx}
                    className="form-control "
                    onChange={props.onchange}
                />
            </td>
            {props.dataset_type === "C" ? (
                <td>
                    <select
                        name="distribution"
                        className="form-control"
                        value={props.item.distribution}
                        id={props.idx}
                        onChange={props.onchange}>
                        <option>Select</option>
                        <option value="Normal">Normal</option>
                        <option value="log normal">Log normal</option>
                    </select>
                </td>
            ) : null}
            {props.dataset_type === "C" ? (
                <td>
                    <select
                        name="variance"
                        id={props.idx}
                        className="form-control"
                        value={props.item.variance}
                        onChange={props.onchange}>
                        <option value="Constant">Constant</option>
                        <option value="Non Constant">Non-Constant</option>
                    </select>
                </td>
            ) : null}
            {props.dataset_type === "C" ? (
                <td>
                    <select
                        name="polynomial_restriction"
                        id={props.idx}
                        className="form-control"
                        value={props.item.polynomial_restriction}
                        onChange={props.onchange}>
                        <option>Select</option>
                        <option value="Use dataset adverse direction">
                            Use dataset adverse direction
                        </option>
                        <option value="Non-Negative">Non-negetive</option>
                        <option value="Non-Positive">Non-positive</option>
                    </select>
                </td>
            ) : null}
            <td>
                <select
                    name="background"
                    id={props.idx}
                    className="form-control"
                    value={props.item.background}
                    onChange={props.onchange}>
                    <option>Select</option>
                    <option value="Estimated">Estimated</option>
                </select>
            </td>

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
export default OptionsForm;
