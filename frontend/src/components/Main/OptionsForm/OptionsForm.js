import React from "react";
import PropTypes from "prop-types";

import * as mc from "../../../constants/mainConstants";

const OptionsForm = props => {
    return (
        <tr className="form-group">
            {props.modelType === mc.MODEL_CONTINUOUS ? (
                <td>
                    <select
                        className="form-control"
                        value={props.options.bmr_type}
                        onChange={e =>
                            props.saveOptions("bmr_type", parseInt(e.target.value), props.idx)
                        }>
                        <option value="2">Std. Dev.</option>
                        <option value="3">Rel. Dev.</option>
                        <option value="1">Abs. Dev</option>
                        <option value="4">Point</option>
                        <option value="6">Hybrid-Extra Risk</option>
                        <option value="7">Hybrid-Added Risk</option>
                    </select>
                </td>
            ) : null}
            {props.modelType == mc.MODEL_DICHOTOMOUS ? (
                <td>
                    <select
                        className="form-control"
                        value={props.options.bmr_type}
                        onChange={e =>
                            props.saveOptions("bmr_type", parseInt(e.target.value), props.idx)
                        }>
                        <option value="1">Extra Risk</option>
                        <option value="2">Added Risk</option>
                    </select>
                </td>
            ) : null}

            <td>
                <input
                    type="number"
                    className="form-control text-center"
                    value={props.options.bmr_value}
                    onChange={e =>
                        props.saveOptions("bmr_value", parseFloat(e.target.value), props.idx)
                    }
                />
            </td>
            {props.modelType === mc.MODEL_CONTINUOUS ? (
                <td>
                    <input
                        type="number"
                        className="form-control text-center"
                        value={props.options.tail_probability}
                        onChange={e =>
                            props.saveOptions(
                                "tail_probability",
                                parseFloat(e.target.value),
                                props.idx
                            )
                        }
                    />
                </td>
            ) : null}
            <td>
                <input
                    className="form-control text-center"
                    type="number"
                    value={props.options.confidence_level}
                    onChange={e =>
                        props.saveOptions("confidence_level", parseFloat(e.target.value), props.idx)
                    }
                />
            </td>
            {props.modelType === mc.MODEL_CONTINUOUS ? (
                <td>
                    <select
                        className="form-control"
                        value={props.options.dist_type}
                        onChange={e =>
                            props.saveOptions("dist_type", parseInt(e.target.value), props.idx)
                        }>
                        <option value="1">Normal + Constant</option>
                        <option value="2">Normal + Non-constant</option>
                        {/* <option value="3">Log-normal</option>  TODO - add back */}
                    </select>
                </td>
            ) : null}
            <td>
                <button
                    type="button"
                    className="btn btn-danger"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Delete Option Set"
                    onClick={e => props.deleteOptions(props.idx)}>
                    <i className="fa fa-trash"></i>
                </button>
            </td>
        </tr>
    );
};

OptionsForm.propTypes = {
    optionsStore: PropTypes.string,
    idx: PropTypes.number.isRequired,
    modelType: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    saveOptions: PropTypes.func.isRequired,
    deleteOptions: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired,
    bmr_value: PropTypes.number,
    tail_probability: PropTypes.number,
    distribution: PropTypes.string,
    variance: PropTypes.string,
    background: PropTypes.string,
    delete: PropTypes.func,
};
export default OptionsForm;
