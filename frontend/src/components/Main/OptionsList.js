import React from "react";
const OptionsList = props => {
    return props.optionsList.map((val, idx) => {
        let bmr_type = `bmr_type-${idx}`,
            bmr_value = `bmr_value-${idx}`,
            tail_probability = `tail_probability-${idx}`,
            confidence_level = `confidence_level-${idx}`,
            distribution = `distribution-${idx}`,
            variance = `variance-${idx}`,
            polynomial_restriction = `polynomial_restriction-${idx}`,
            background = `background-${idx}`;
        return (
            <tr key={idx}>
                <td>{idx}</td>
                <td>
                    <select name="bmr_type" id={bmr_type} data-id={idx} className="form-control">
                        <option value="">select</option>
                        <option value="Std. Dev.">Std. Dev.</option>
                        <option value="Rel. Dev.">Rel. Dev.</option>
                        <option value="Abs. Dev.">Abs. Dev.</option>
                        <option value="Point">Point</option>
                        <option value="Hybrid Extra Risk">Hybrid- extra risk</option>
                    </select>
                </td>

                <td>
                    <input
                        type="number"
                        name="bmr_value"
                        id={bmr_value}
                        data-id={idx}
                        className="form-control "
                    />
                </td>
                <td>
                    <input
                        type="number"
                        name="tail_probability"
                        id={tail_probability}
                        data-id={idx}
                        className="form-control "
                    />
                </td>
                <td>
                    <input
                        type="number"
                        name="confidence_level"
                        id={confidence_level}
                        data-id={idx}
                        className="form-control "
                    />
                </td>

                <td>
                    <select
                        name="distribution"
                        id={distribution}
                        data-id={idx}
                        className="form-control">
                        <option value="">select</option>
                        <option value="Normal">Normal</option>
                        <option value="log normal">Log normal</option>
                    </select>
                </td>

                <td>
                    <select name="variance" id={variance} data-id={idx} className="form-control">
                        <option value="">select</option>
                        <option value="Constant">Constant</option>
                        <option value="Non Constant">Non-Constant</option>
                    </select>
                </td>

                <td>
                    <select
                        name="polynomial_restriction"
                        id={polynomial_restriction}
                        data-id={idx}
                        className="form-control">
                        <option value="">select</option>
                        <option value="Use dataset adverse direction">
                            Use dataset adverse direction
                        </option>
                        <option value="Non-Negetive">Non-negetive</option>
                        <option value="Non-Positive">Non-positive</option>
                    </select>
                </td>

                <td>
                    <select
                        name="background"
                        id={background}
                        data-id={idx}
                        className="form-control">
                        <option value="">select</option>
                        <option value="Estimated">Estimated</option>
                    </select>
                </td>

                <td>
                    <button
                        className="btn btn-danger close"
                        aria-label="Close"
                        onClick={() => props.delete(val)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </td>
            </tr>
        );
    });
};
export default OptionsList;
