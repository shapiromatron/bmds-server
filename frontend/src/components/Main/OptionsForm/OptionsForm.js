import React from "react";
import PropTypes from "prop-types";

import * as mc from "../../../constants/mainConstants";
import {
    bmr_type,
    other_bmr_type,
    litter_specific_covariate,
    distribution,
    variance,
    polynomial_restriction,
    bootstrap_seed,
} from "../../../constants/optionsConstants";

const OptionsForm = props => {
    return (
        <tr className="form-group">
            {props.modelType === mc.MODEL_CONTINUOUS ? (
                <td>
                    <select
                        className="form-control"
                        value={props.options.bmr_type}
                        onChange={e => props.saveOptions("bmr_type", e.target.value, props.idx)}>
                        {bmr_type.map((item, i) => {
                            return (
                                <option key={i} value={item.value}>
                                    {item.name}
                                </option>
                            );
                        })}
                    </select>
                </td>
            ) : null}
            {props.modelType != mc.MODEL_CONTINUOUS ? (
                <td>
                    <select
                        className="form-control"
                        value={props.options.bmr_type}
                        onChange={e => props.saveOptions("bmr_type", e.target.value, props.idx)}>
                        {other_bmr_type.map((item, i) => {
                            return (
                                <option key={i} value={item.value}>
                                    {item.name}
                                </option>
                            );
                        })}
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
            {props.modelType === mc.MODEL_NESTED ? (
                <td>
                    <select
                        className="form-control"
                        value={props.options.litter_specific_covariate}
                        onChange={e =>
                            props.saveOptions(
                                "litter_specific_covariate",
                                e.target.value,
                                props.idx
                            )
                        }>
                        {litter_specific_covariate.map((item, i) => {
                            return (
                                <option key={i} value={item.value}>
                                    {item.name}
                                </option>
                            );
                        })}
                    </select>
                </td>
            ) : null}

            {props.modelType === mc.MODEL_CONTINUOUS ? (
                <td>
                    <select
                        className="form-control"
                        value={props.options.distribution}
                        onChange={e =>
                            props.saveOptions("distribution", e.target.value, props.idx)
                        }>
                        {distribution.map((item, i) => {
                            return (
                                <option key={i} value={item.value}>
                                    {item.name}
                                </option>
                            );
                        })}
                    </select>
                </td>
            ) : null}
            {props.modelType === mc.MODEL_CONTINUOUS ? (
                <td>
                    <select
                        className="form-control"
                        value={props.options.variance}
                        onChange={e => props.saveOptions("variance", e.target.value, props.idx)}>
                        {variance.map((item, i) => {
                            return (
                                <option key={i} value={item.value}>
                                    {item.name}
                                </option>
                            );
                        })}
                    </select>
                </td>
            ) : null}
            {props.modelType === mc.MODEL_CONTINUOUS ? (
                <td>
                    <select
                        className="form-control"
                        value={props.options.polynomial_restriction}
                        onChange={e =>
                            props.saveOptions("polynomial_restriction", e.target.value, props.idx)
                        }>
                        {polynomial_restriction.map((item, i) => {
                            return (
                                <option key={i} value={item.value}>
                                    {item.name}
                                </option>
                            );
                        })}
                    </select>
                </td>
            ) : null}
            {props.modelType == mc.MODEL_DICHOTOMOUS ? (
                <td>
                    <select
                        className="form-control"
                        value={props.options.background}
                        onChange={e => props.saveOptions("background", e.target.value, props.idx)}>
                        <option value="Estimated">Estimated</option>
                    </select>
                </td>
            ) : null}
            {props.modelType === mc.MODEL_NESTED ? (
                <td>
                    <input
                        type="number"
                        className="form-control"
                        value={props.options.bootstrap_iterations}
                        onChange={e =>
                            props.saveOptions("bootstrap_iterations", e.target.value, props.idx)
                        }
                    />
                </td>
            ) : null}
            {props.modelType === mc.MODEL_NESTED ? (
                <td>
                    <select
                        className="form-control"
                        value={props.options.bootstrap_seed}
                        onChange={e =>
                            props.saveOptions("bootstrap_seed", e.target.value, props.idx)
                        }>
                        {bootstrap_seed.map((item, i) => {
                            return (
                                <option key={i} value={item.value}>
                                    {item.name}
                                </option>
                            );
                        })}
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
    litter_specific_covariate: PropTypes.string,
    distribution: PropTypes.string,
    variance: PropTypes.string,
    background: PropTypes.string,
    bootstrap_iterations: PropTypes.string,
    bootstrap_seed: PropTypes.string,
    delete: PropTypes.func,
};
export default OptionsForm;
