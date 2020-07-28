import React from "react";

const Results = props => {
    return (
        <table className="table table-bordered result table-sm">
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
                        <tr
                            key={idx}
                            className="result-row"
                            onMouseOver={e => props.onMouseOver(e, val.model_index)}
                            onMouseOut={e => props.onMouseOut(e)}>
                            <td className="button">
                                <button
                                    onClick={e =>
                                        props.onClick(e, props.selectedOutput, val.model_index)
                                    }
                                    className="btn btn-primary btn-sm">
                                    {val.model_name}{" "}
                                </button>
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
