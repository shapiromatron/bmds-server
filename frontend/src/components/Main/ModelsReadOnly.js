import React from "react";

const ModelsReadOnly = props => {
    return (
        <tbody>
            {props.models.map((item, index) => {
                return [
                    <tr key={index}>
                        <td>{item.model}</td>
                        {item.values.map((dev, index) => {
                            return [
                                <td key={index}>
                                    {dev.isChecked ? (
                                        <i className="fa fa-check-square-o"></i>
                                    ) : (
                                        <i className="fa fa-square-o"></i>
                                    )}
                                    &emsp;&emsp;
                                    {dev.name.includes("bayesian_model_average")
                                        ? dev.prior_weight + "%"
                                        : null}
                                </td>,
                            ];
                        })}
                    </tr>,
                ];
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

export default ModelsReadOnly;
