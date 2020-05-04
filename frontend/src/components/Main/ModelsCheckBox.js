import React from "react";

const ContinuousCheckBox = props => {
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
                                        type="checkbox"
                                        name={dev.name}
                                        onChange={props.onChange}
                                        defaultChecked={dev.isChecked}
                                    />
                                </td>,
                            ];
                        })}
                        <td></td>
                    </tr>,
                ];
            })}
        </tbody>
    );
};

export default ContinuousCheckBox;
