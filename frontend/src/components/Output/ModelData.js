import React from "react";

const ModelData = props => {
    return (
        <table className="table table-bordered">
            <thead>
                <tr className="table-primary">
                    <th colSpan="2">Model Data</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(props.modelData).map((dev, i) => {
                    return [
                        <tr key={i}>
                            <td>{props.modelData[dev].label}</td>
                            <td>{props.modelData[dev].value}</td>
                        </tr>,
                    ];
                })}
            </tbody>
        </table>
    );
};

export default ModelData;
