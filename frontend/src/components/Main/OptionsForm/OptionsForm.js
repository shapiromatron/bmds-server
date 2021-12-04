import React from "react";
import PropTypes from "prop-types";

import * as mc from "../../../constants/mainConstants";
import SelectInput from "../../common/SelectInput";
import {
    dichotomousBmrOptions,
    continuousBmrOptions,
    distTypeOptions,
    litterSpecificCovariateOptions,
    backgroundOptions,
} from "../../../constants/optionsConstants";
import IntegerInput from "../../common/IntegerInput";
import FloatInput from "../../common/FloatInput";
import Button from "../../common/Button";

const OptionsForm = props => {
    return (
        <tr className="form-group">
            {props.modelType === mc.MODEL_CONTINUOUS ? (
                <td>
                    <SelectInput
                        choices={continuousBmrOptions.map(option => {
                            return {value: option.value, text: option.label};
                        })}
                        onChange={value =>
                            props.saveOptions("bmr_type", parseInt(value), props.idx)
                        }
                        value={props.options.bmr_type}
                    />
                </td>
            ) : null}
            {props.modelType == mc.MODEL_DICHOTOMOUS ||
            props.modelType == mc.MODEL_NESTED_DICHOTOMOUS ||
            props.modelType == mc.MODEL_MULTI_TUMOR ? (
                <td>
                    <SelectInput
                        choices={dichotomousBmrOptions.map(option => {
                            return {value: option.value, text: option.label};
                        })}
                        onChange={value =>
                            props.saveOptions("bmr_type", parseInt(value), props.idx)
                        }
                        value={props.options.bmr_type}
                    />
                </td>
            ) : null}

            <td>
                <FloatInput
                    onChange={value => props.saveOptions("bmr_value", value, props.idx)}
                    value={props.options.bmr_value}
                />
            </td>
            {props.modelType === mc.MODEL_CONTINUOUS ? (
                <td>
                    <FloatInput
                        value={props.options.tail_probability}
                        onChange={value => props.saveOptions("tail_probability", value, props.idx)}
                    />
                </td>
            ) : null}
            <td>
                <FloatInput
                    value={props.options.confidence_level}
                    onChange={value => props.saveOptions("confidence_level", value, props.idx)}
                />
            </td>
            {props.modelType === mc.MODEL_CONTINUOUS ? (
                <td>
                    <SelectInput
                        choices={distTypeOptions.map(option => {
                            return {value: option.value, text: option.label};
                        })}
                        onChange={value =>
                            props.saveOptions("dist_type", parseInt(value), props.idx)
                        }
                        value={props.options.dist_type}
                    />
                </td>
            ) : null}
            {props.modelType === mc.MODEL_NESTED_DICHOTOMOUS ? (
                <>
                    <td>
                        <SelectInput
                            value={props.options.litter_specific_covariate}
                            onChange={value =>
                                props.saveOptions(
                                    "litter_specific_covariate",
                                    parseInt(value),
                                    props.idx
                                )
                            }
                            choices={litterSpecificCovariateOptions.map(option => {
                                return {value: option.value, text: option.label};
                            })}
                        />
                    </td>
                    <td>
                        <SelectInput
                            value={props.options.background}
                            onChange={value =>
                                props.saveOptions("background", parseInt(value), props.idx)
                            }
                            choices={backgroundOptions.map(option => {
                                return {value: option.value, text: option.label};
                            })}
                        />
                    </td>
                    <td>
                        <IntegerInput
                            value={props.options.bootstrap_iterations}
                            onChange={value =>
                                props.saveOptions("bootstrap_iterations", value, props.idx)
                            }
                        />
                    </td>
                    <td>
                        <IntegerInput
                            value={props.options.bootstrap_seed}
                            onChange={value =>
                                props.saveOptions("bootstrap_seed", value, props.idx)
                            }
                        />
                    </td>
                </>
            ) : null}
            <td>
                <Button
                    className="btn btn-danger"
                    title="Delete Option Set"
                    onClick={e => props.deleteOptions(props.idx)}
                    faClass="fa fa-trash"
                />
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
