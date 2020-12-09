import React from "react";
import PropTypes from "prop-types";
import {
    bmr_type,
    other_bmr_type,
    litter_specific_covariate,
    distribution,
    variance,
    polynomial_restriction,
    bootstrap_seed,
    datasetType,
} from "../../../constants/optionsConstants";

const OptionsForm = props => {
    return (
        <tr className="form-group">
            {props.dataset_type === datasetType.Continuous ? (
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
            {props.dataset_type != datasetType.Continuous ? (
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
            {props.dataset_type === datasetType.Continuous ? (
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
            {props.dataset_type === datasetType.Nested ? (
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

            {props.dataset_type === datasetType.Continuous ? (
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
            {props.dataset_type === datasetType.Continuous ? (
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
            {props.dataset_type === datasetType.Continuous ? (
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
            {props.dataset_type != datasetType.Dichotomous ? (
                <td>
                    <select
                        className="form-control"
                        value={props.options.background}
                        onChange={e => props.saveOptions("background", e.target.value, props.idx)}>
                        <option value="Estimated">Estimated</option>
                    </select>
                </td>
            ) : null}
            {props.dataset_type === datasetType.Nested ? (
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
            {props.dataset_type === datasetType.Nested ? (
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
    optionsLis: PropTypes.array,
    idx: PropTypes.number,
    dataset_type: PropTypes.string,
    onChange: PropTypes.func,
    saveOptions: PropTypes.func,
    deleteOptions: PropTypes.func,
    options: PropTypes.object,
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
