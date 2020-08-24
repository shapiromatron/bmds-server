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
                            name="bmr_type"
                            className="form-control"
                            value={options.bmr_type}
                            id={this.props.idx}
                            onChange={e =>
                                optionsStore.saveOptions(e.target.name, e.target.value, e.target.id)
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
                            name="bmr_type"
                            className="form-control"
                            value={this.props.options.bmr_type}
                            id={this.props.idx}
                            onChange={e =>
                                optionsStore.saveOptions(e.target.name, e.target.value, e.target.id)
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
                        name="bmr_value"
                        className="form-control"
                        value={this.props.options.bmr_value}
                        id={this.props.idx}
                        onChange={e =>
                            optionsStore.saveOptions(e.target.name, e.target.value, e.target.id)
                        }
                    />
                </td>
                {this.props.dataset_type === "C" ? (
                    <td>
                        <input
                            type="number"
                            name="tail_probability"
                            className="form-control"
                            value={this.props.options.tail_probability}
                            id={this.props.idx}
                            onChange={e =>
                                optionsStore.saveOptions(e.target.name, e.target.value, e.target.id)
                            }
                        />
                    </td>
                ) : null}
                <td>
                    <input
                        className="form-control"
                        type="number"
                        name="confidence_level"
                        value={this.props.options.confidence_level}
                        id={this.props.idx}
                        onChange={e =>
                            optionsStore.saveOptions(e.target.name, e.target.value, e.target.id)
                        }
                    />
                </td>
                {this.props.dataset_type === "N" ? (
                    <td>
                        <select
                            name="litter_specific_covariate"
                            className="form-control"
                            value={this.props.options.litter_specific_covariate}
                            id={this.props.idx}
                            onChange={e =>
                                optionsStore.saveOptions(e.target.name, e.target.value, e.target.id)
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
                            name="distribution"
                            className="form-control"
                            value={this.props.options.distribution}
                            id={this.props.idx}
                            onChange={e =>
                                optionsStore.saveOptions(e.target.name, e.target.value, e.target.id)
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
                            name="variance"
                            id={this.props.idx}
                            className="form-control"
                            value={this.props.options.variance}
                            onChange={e =>
                                optionsStore.saveOptions(e.target.name, e.target.value, e.target.id)
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
                            name="polynomial_restriction"
                            id={this.props.idx}
                            className="form-control"
                            value={this.props.options.polynomial_restriction}
                            onChange={e =>
                                optionsStore.saveOptions(e.target.name, e.target.value, e.target.id)
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
                            name="background"
                            id={this.props.idx}
                            className="form-control"
                            value={this.props.options.background}
                            onChange={e =>
                                optionsStore.saveOptions(e.target.name, e.target.value, e.target.id)
                            }>
                            <option value="Estimated">Estimated</option>
                        </select>
                    </td>
                ) : null}
                {this.props.dataset_type === "N" ? (
                    <td>
                        <input
                            type="number"
                            name="bootstrap_iterations"
                            className="form-control"
                            value={this.props.options.bootstrap_iterations}
                            id={this.props.idx}
                            onChange={e =>
                                optionsStore.saveOptions(e.target.name, e.target.value, e.target.id)
                            }
                        />
                    </td>
                ) : null}
                {this.props.dataset_type === "N" ? (
                    <td>
                        <select
                            name="bootstrap_seed"
                            id={this.props.idx}
                            className="form-control"
                            value={this.props.options.bootstrap_seed}
                            onChange={e =>
                                optionsStore.saveOptions(e.target.name, e.target.value, e.target.id)
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
