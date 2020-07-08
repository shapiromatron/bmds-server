import React from "react";

const BenchmarkDose = props => {
    return (
        <table className="table table-bordered table-sm">
            <thead>
                <tr className="table-primary">
                    <th colSpan="2">Benchmark Dose</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(props.benchmarkDose).map((dev, i) => {
                    return [
                        <tr key={i}>
                            <td>{props.benchmarkDose[dev].label}</td>
                            <td>{props.benchmarkDose[dev].value}</td>
                        </tr>,
                    ];
                })}
            </tbody>
        </table>
    );
};

export default BenchmarkDose;
