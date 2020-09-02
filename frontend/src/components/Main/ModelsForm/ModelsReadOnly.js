import React from "react";
import PropTypes from "prop-types";
import {model} from "../../../constants/modelConstants";
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
                                    {dev.isChecked ? (
                                        <i className="fa fa-check-square-o"></i>
                                    ) : (
                                        <i className="fa fa-square-o"></i>
                                    )}
                                    &emsp;&emsp;
                                    {dev.name.includes(model.Bayesian_Model_Average)
                                        ? dev.prior_weight + "%"
                                        : null}
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
