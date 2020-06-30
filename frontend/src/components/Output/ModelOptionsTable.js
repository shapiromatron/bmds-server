import React from "react";

const ModelOptionsTable = props => {
    return (
        <table className="table table-bordered">
            <thead>
                <tr className="table-primary">
                    <th colSpan="2">Model Options</th>
                </tr>
            </thead>
            <tbody>
                {props.modelOptions.map((dev, i) => {
                    return [
                        <tr key={i}>
                            <td>{dev.label}</td>
                            <td>{dev.value}</td>
                        </tr>,
                    ];
                })}
            </tbody>
        </table>
    );
};

export default ModelOptionsTable;
