import React from "react";

const OptionsForm = props => {
    return (
        <tr className="form-group">
            <td>{props.idx}</td>
            {props.dataset_type === "C" ? (
                <td>
                    <select
                        name="bmr_type"
                        className="form-control"
                        value={props.item.bmr_type}
                        id={props.idx}
                        onChange={props.onchange}>
                        <option value="Std. Dev.">Std. Dev.</option>
                        <option value="Rel. Dev.">Rel. Dev.</option>
                        <option value="Abs. Dev.">Abs. Dev.</option>
                        <option value="Point">Point</option>
                        <option value="Hybrid Extra Risk">Hybrid- extra risk</option>
                    </select>
                </td>
            ) : null}
            {props.dataset_type != "C" ? (
                <td>
                    <select
                        name="bmr_type"
                        className="form-control"
                        value={props.item.bmr_type}
                        id={props.idx}
                        onChange={props.onchange}>
                        <option value="Extra">Extra Risk</option>
                        <option value="Added">Added Risk</option>
                    </select>
                </td>
            ) : null}

            <td>
                <input
                    type="number"
                    name="bmr_value"
                    className="form-control"
                    value={props.item.bmr_value}
                    id={props.idx}
                    onChange={props.onchange}
                />
            </td>
            {props.dataset_type === "C" ? (
                <td>
                    <input
                        type="number"
                        name="tail_probability"
                        className="form-control"
                        value={props.item.tail_probability}
                        id={props.idx}
                        onChange={props.onchange}
                    />
                </td>
            ) : null}
            <td>
                <input
                    className="form-control"
                    type="number"
                    name="confidence_level"
                    value={props.item.confidence_level}
                    id={props.idx}
                    onChange={props.onchange}
                />
            </td>
            {props.dataset_type === "N" ? (
                <td>
                    <select
                        name="litter_specific_covariate"
                        className="form-control"
                        value={props.item.litter_specific_covariate}
                        id={props.idx}
                        onChange={props.onchange}>
                        <option value="Overall_Mean">Overall Mean</option>
                        <option value="Control_Group_Mean">Control Group Mean</option>
                    </select>
                </td>
            ) : null}

            {props.dataset_type === "C" ? (
                <td>
                    <select
                        name="distribution"
                        className="form-control"
                        value={props.item.distribution}
                        id={props.idx}
                        onChange={props.onchange}>
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
                        <option value="Non-constant">Non-Constant</option>
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
                        <option value="Use dataset adverse direction">
                            Use dataset adverse direction
                        </option>
                        <option value="Non-Negative">Non-negetive</option>
                        <option value="Non-Positive">Non-positive</option>
                    </select>
                </td>
            ) : null}
            {props.dataset_type != "DM" ? (
                <td>
                    <select
                        name="background"
                        id={props.idx}
                        className="form-control"
                        value={props.item.background}
                        onChange={props.onchange}>
                        <option value="Estimated">Estimated</option>
                    </select>
                </td>
            ) : null}
            {props.dataset_type === "N" ? (
                <td>
                    <input
                        type="number"
                        name="bootstrap_iterations"
                        className="form-control"
                        value={props.item.bootstrap_iterations}
                        id={props.idx}
                        onChange={props.onchange}
                    />
                </td>
            ) : null}
            {props.dataset_type === "N" ? (
                <td>
                    <select
                        name="bootstrap_seed"
                        id={props.idx}
                        className="form-control"
                        value={props.item.bootstrap_seed}
                        onChange={props.onchange}>
                        <option value="Automatic">Automatic</option>
                        <option value="User_Specified">User Specified</option>
                    </select>
                </td>
            ) : null}
            <td>
                <button
                    className="btn btn-danger"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Delete Option Set"
                    onClick={e => props.delete(e, props.idx)}>
                    <i className="fa fa-trash"></i>
                </button>
            </td>
        </tr>
    );
};
export default OptionsForm;
