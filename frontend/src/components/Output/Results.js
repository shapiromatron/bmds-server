import React from "react";

const Results = props => {
    return (
        <table className="table table-bordered result">
            <thead>
                <tr className="table-primary">
                    <th>Model</th>
                    <th>BMD</th>
                    <th>BMDL</th>
                    <th>BMDU</th>
                    <th>AIC</th>
                </tr>
            </thead>
            <tbody>
                {props.selectedOutput.models.map((val, idx) => {
                    return [
                        <tr key={idx}>
                            <td
                                className="td-modelName"
                                onClick={e =>
                                    props.onClick(e, props.selectedOutput, val.model_index)
                                }>
                                {val.model_name}
                            </td>
                            <td>{val.results.bmd}</td>
                            <td>{val.results.bmdl}</td>
                            <td>{val.results.bmdu}</td>
                            <td>{val.results.aic}</td>
                        </tr>,
                    ];
                })}
            </tbody>
        </table>
    );
};

export default Results;
