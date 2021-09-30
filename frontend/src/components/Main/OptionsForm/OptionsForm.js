import React from "react";
import PropTypes from "prop-types";

import * as mc from "../../../constants/mainConstants";
import SelectInput from "../../common/SelectInput";
import {
    dichotomousBmrOptions,
    continuousBmrOptions,
    distTypeOptions,
} from "../../../constants/optionsConstants";
import IntegerInput from "../../common/IntegerInput";

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
            {props.modelType == mc.MODEL_DICHOTOMOUS ? (
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
                <IntegerInput
                    onChange={value => props.saveOptions("bmr_value", parseFloat(value), props.idx)}
                    value={props.options.bmr_value}
                />
            </td>
            {props.modelType === mc.MODEL_CONTINUOUS ? (
                <td>
                    <IntegerInput
                        value={props.options.tail_probability}
                        onChange={value =>
                            props.saveOptions("tail_probability", parseFloat(value), props.idx)
                        }
                    />
                </td>
            ) : null}
            <td>
                <IntegerInput
                    value={props.options.confidence_level}
                    onChange={value =>
                        props.saveOptions("confidence_level", parseFloat(value), props.idx)
                    }
                />
            </td>
            {props.modelType === mc.MODEL_CONTINUOUS ? (
                <td>
                    <SelectInput
                        choices={distTypeOptions.map(option => {
                            return {value: option.value, text: option.label};
                        })}
                        onChange={value =>
                            props.saveOptions("bmr_type", parseInt(value), props.idx)
                        }
                        value={props.options.dist_type}
                    />
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
