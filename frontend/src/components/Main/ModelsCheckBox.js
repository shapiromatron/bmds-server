import React from "react";

const ModelsCheckBox = props => {
    return (
        <tbody>
            {props.models.map((item, index) => {
                return [
                    <tr key={index}>
                        <td>{item.model}</td>
                        {item.values.map((dev, index) => {
                            return [
                                <td key={index}>
                                    <input
                                        className="checkbox"
                                        type={dev.type}
                                        name={dev.name}
                                        onChange={props.onChange}
                                        checked={dev.isChecked}
                                        disabled={dev.isDisabled}
                                    />

                                    {dev.name.includes("bayesian_model_average") ? (
                                        <input
                                            type="text"
                                            name={dev.name}
                                            value={dev.prior_weight + "%"}
                                            onChange={props.onChange}
                                        />
                                    ) : null}
                                </td>,
                            ];
                        })}
                    </tr>,
                ];
            })}
            {props.models.length > 2 ? (
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                        Total Weights{" "}
                        <input name="total_weights" type="text" onChange={props.onChange} />
                    </td>
                </tr>
            ) : null}
        </tbody>
    );
};

export default ModelsCheckBox;
