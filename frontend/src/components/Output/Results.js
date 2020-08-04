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
                {props.selectedOutput.models.map((model, idx) => {
                    return [
                        <tr
                            key={idx}
                            className="result-row"
                            onMouseOver={e => props.onMouseOver(e, model)}
                            onMouseOut={e => props.onMouseOut(e)}>
                            <td className="button">
                                <button
                                    onClick={e =>
                                        props.onClick(e, props.selectedOutput, model.model_index)
                                    }
                                    className="btn btn-primary btn-sm">
                                    {model.model_name}{" "}
                                </button>
                            </td>
                            <td>{model.results.bmd}</td>
                            <td>{model.results.bmdl}</td>
                            <td>{model.results.bmdu}</td>
                            <td>{model.results.aic}</td>
                        </tr>,
                    ];
                })}
            </tbody>
        </table>
    );
};

export default Results;
