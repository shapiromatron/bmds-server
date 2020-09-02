import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("optionsStore")
@observer
class OptionsForm extends Component {
    render() {
        const {optionsStore} = this.props,
            options = optionsStore.optionsList[this.props.idx];
        return (
            <tr className="form-group">
                <td>{this.props.idx}</td>
                {this.props.dataset_type === "C" ? (
                    <td>
                        <select
                            className="form-control"
                            value={options.bmr_type}
                            onChange={e =>
                                optionsStore.saveOptions("bmr_type", e.target.value, this.props.idx)
                            }>
                            {optionsStore.getBmrType.map((item, i) => {
                                return [
                                    <option key={i} value={item.value}>
                                        {item.name}
                                    </option>,
                                ];
                            })}
                        </select>
                    </td>
                ) : null}
                {this.props.dataset_type != "C" ? (
                    <td>
                        <select
                            className="form-control"
                            value={this.props.options.bmr_type}
                            onChange={e =>
                                optionsStore.saveOptions("bmr_type", e.target.value, this.props.idx)
                            }>
                            {optionsStore.getOtherBmrType.map((item, i) => {
                                return [
                                    <option key={i} value={item.value}>
                                        {item.name}
                                    </option>,
                                ];
                            })}
                        </select>
                    </td>
                ) : null}

                <td>
                    <input
                        type="number"
                        className="form-control"
                        value={this.props.options.bmr_value}
                        onChange={e =>
                            optionsStore.saveOptions("bmr_value", e.target.value, this.props.idx)
                        }
                    />
                </td>
                {this.props.dataset_type === "C" ? (
                    <td>
                        <input
                            type="number"
                            className="form-control"
                            value={this.props.options.tail_probability}
                            onChange={e =>
                                optionsStore.saveOptions(
                                    "tail_probability",
                                    e.target.value,
                                    this.props.idx
                                )
                            }
                        />
                    </td>
                ) : null}
                <td>
                    <input
                        className="form-control"
                        type="number"
                        value={this.props.options.confidence_level}
                        onChange={e =>
                            optionsStore.saveOptions(
                                "confidence_level",
                                e.target.value,
                                this.props.idx
                            )
                        }
                    />
                </td>
                {this.props.dataset_type === "N" ? (
                    <td>
                        <select
                            className="form-control"
                            value={this.props.options.litter_specific_covariate}
                            onChange={e =>
                                optionsStore.saveOptions(
                                    "litter_specific_covariate",
                                    e.target.value,
                                    this.props.idx
                                )
                            }>
                            {optionsStore.getLitterSpecificCovariate.map((item, i) => {
                                return [
                                    <option key={i} value={item.value}>
                                        {item.name}
                                    </option>,
                                ];
                            })}
                        </select>
                    </td>
                ) : null}

                {this.props.dataset_type === "C" ? (
                    <td>
                        <select
                            className="form-control"
                            value={this.props.options.distribution}
                            onChange={e =>
                                optionsStore.saveOptions(
                                    "distribution",
                                    e.target.value,
                                    this.props.idx
                                )
                            }>
                            {optionsStore.getDistribution.map((item, i) => {
                                return [
                                    <option key={i} value={item.value}>
                                        {item.name}
                                    </option>,
                                ];
                            })}
                        </select>
                    </td>
                ) : null}
                {this.props.dataset_type === "C" ? (
                    <td>
                        <select
                            className="form-control"
                            value={this.props.options.variance}
                            onChange={e =>
                                optionsStore.saveOptions("variance", e.target.value, this.props.idx)
                            }>
                            {optionsStore.getVariance.map((item, i) => {
                                return [
                                    <option key={i} value={item.value}>
                                        {item.name}
                                    </option>,
                                ];
                            })}
                        </select>
                    </td>
                ) : null}
                {this.props.dataset_type === "C" ? (
                    <td>
                        <select
                            className="form-control"
                            value={this.props.options.polynomial_restriction}
                            onChange={e =>
                                optionsStore.saveOptions(
                                    "polynomial_restriction",
                                    e.target.value,
                                    this.props.idx
                                )
                            }>
                            {optionsStore.getPolynomialRestriction.map((item, i) => {
                                return [
                                    <option key={i} value={item.value}>
                                        {item.name}
                                    </option>,
                                ];
                            })}
                        </select>
                    </td>
                ) : null}
                {this.props.dataset_type != "DM" ? (
                    <td>
                        <select
                            className="form-control"
                            value={this.props.options.background}
                            onChange={e =>
                                optionsStore.saveOptions(
                                    "background",
                                    e.target.value,
                                    this.props.idx
                                )
                            }>
                            <option value="Estimated">Estimated</option>
                        </select>
                    </td>
                ) : null}
                {this.props.dataset_type === "N" ? (
                    <td>
                        <input
                            type="number"
                            className="form-control"
                            value={this.props.options.bootstrap_iterations}
                            onChange={e =>
                                optionsStore.saveOptions(
                                    "bootstrap_iterations",
                                    e.target.value,
                                    this.props.idx
                                )
                            }
                        />
                    </td>
                ) : null}
                {this.props.dataset_type === "N" ? (
                    <td>
                        <select
                            className="form-control"
                            value={this.props.options.bootstrap_seed}
                            onChange={e =>
                                optionsStore.saveOptions(
                                    "bootstrap_seed",
                                    e.target.value,
                                    this.props.idx
                                )
                            }>
                            {optionsStore.getBootstrapSeed.map((item, i) => {
                                return [
                                    <option key={i} value={item.value}>
                                        {item.name}
                                    </option>,
                                ];
                            })}
                        </select>
                    </td>
                ) : null}
                <td>
                    <button
                        className="btn btn-danger"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Delete Option Set"
                        onClick={e => optionsStore.deleteOptions(e, this.props.idx)}>
                        <i className="fa fa-trash"></i>
                    </button>
                </td>
            </tr>
        );
    }
}

OptionsForm.propTypes = {
    optionsStore: PropTypes.string,
    optionsLis: PropTypes.array,
    idx: PropTypes.number,
    dataset_type: PropTypes.string,
    onChange: PropTypes.func,
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
