import React from "react";

const DGoodnessFit = props => {
    return (
        <tbody>
            {props.goodnessfit.map((row, index) => {
                return [
                    <tr key={index}>
                        <td>{row.dose}</td>
                        <td>{row.est_prob}</td>
                        <td>{row.expected}</td>
                        <td>{row.observed}</td>
                        <td>{row.size}</td>
                        <td>{row.scaled_residual}</td>
                    </tr>,
                ];
            })}
        </tbody>
    );
};

export default DGoodnessFit;
