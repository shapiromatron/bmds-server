import React from "react";
import PropTypes from "prop-types";
import {model} from "../../../constants/modelConstants";

const ModelsCheckBox = props => {
    return (
        <tbody>
            {props.models.map((item, index) => {
                return (
                    <tr key={index}>
                        <td className="text-left align-middle">{item.model}</td>
                        {item.values.map((dev, index) => {
                            return (
                                <td key={index}>
                                    <input
                                        name={dev.name}
                                        className="align-middle"
                                        type="checkbox"
                                        onChange={e =>
                                            props.toggleModelsCheckBox(dev.name, e.target.checked)
                                        }
                                        checked={dev.isChecked}
                                        disabled={dev.isDisabled}
                                    />

                                    {dev.name.includes(model.Bayesian_Model_Average) ? (
                                        <input
                                            className="form-control form-control-sm align-middle col-sm-3 pl-1 float-right"
                                            type="number"
                                            value={dev.prior_weight}
                                            onChange={e =>
                                                props.savePriorWeight(
                                                    dev.name,
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                        />
                                    ) : null}
                                </td>
                            );
                        })}
                    </tr>
                );
            })}
            {props.models.length > 2 ? (
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                        Total Weights{" "}
                        <input
                            type="number"
                            className="form-control form-control-sm align-middle col-sm-3 pl-1 float-right"
                            readOnly
                            value={props.total_weight}
                        />
                    </td>
                </tr>
            ) : null}
        </tbody>
    );
};
ModelsCheckBox.propTypes = {
    models: PropTypes.array,
    onChange: PropTypes.func,
    length: PropTypes.number,
    toggleModelsCheckBox: PropTypes.func,
    savePriorWeight: PropTypes.func,
    total_weight: PropTypes.number,
};
export default ModelsCheckBox;
