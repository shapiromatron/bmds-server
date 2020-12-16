import React from "react";
import PropTypes from "prop-types";
import {model} from "../../../constants/modelConstants";

import {readOnlyCheckbox} from "../../../common";

const ModelsReadOnly = props => {
    return (
        <tbody>
            {props.models.map((item, index) => {
                return (
                    <tr key={index}>
                        <td>{item.model}</td>
                        {item.values.map((dev, index) => {
                            return (
                                <td key={index}>
                                    {readOnlyCheckbox(dev.isChecked)}
                                    {dev.name.includes(model.Bayesian_Model_Average) ? (
                                        <span>&emsp;&emsp;{dev.prior_weight}%</span>
                                    ) : null}
                                </td>
                            );
                        })}
                    </tr>
                );
            })}
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>Total weight 0%</td>
            </tr>
        </tbody>
    );
};
ModelsReadOnly.propTypes = {
    models: PropTypes.array,
};
export default ModelsReadOnly;
