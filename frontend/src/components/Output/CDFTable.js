import React from "react";

const CDFTable = props => {
    return (
        <table className="table table-bordered">
            <thead>
                <tr className="table-primary">
                    <th colSpan="2">CDF</th>
                </tr>
                <tr>
                    <th>Percentile</th>
                    <th>BMD</th>
                </tr>
            </thead>
            <tbody>
                {props.cdfValues.map((value, i) => {
                    return [
                        <tr key={i}>
                            <td>{value.pValue}</td>
                            <td>{value.cdf}</td>
                        </tr>,
                    ];
                })}
            </tbody>
        </table>
    );
};

export default CDFTable;
