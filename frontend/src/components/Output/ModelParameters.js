import React from "react";

const ModelParameters = props => {
    return (
        <table className="table table-bordered">
            <thead>
                <tr className="table-primary">
                    <th colSpan="2">Model Parameters</th>
                </tr>
                <tr>
                    <th>Variable</th>
                    <th>Parameter</th>
                </tr>
            </thead>
            <tbody>
                {props.parameters.map((value, i) => {
                    return [
                        <tr key={i}>
                            <td>{value.p_variable}</td>
                            <td>{value.parameter}</td>
                        </tr>,
                    ];
                })}
            </tbody>
        </table>
    );
};

export default ModelParameters;
