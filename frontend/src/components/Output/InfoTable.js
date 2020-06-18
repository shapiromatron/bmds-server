import React from "react";

const InfoTable = props => {
    return (
        <table className="table table-bordered">
            <thead>
                <tr>
                    <th colSpan="2">Info</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(props.infoTable).map((dev, i) => {
                    return [
                        <tr key={i}>
                            <td>{props.infoTable[dev].label}</td>
                            <td>{props.infoTable[dev].value}</td>
                        </tr>,
                    ];
                })}
            </tbody>
        </table>
    );
};

export default InfoTable;
