import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {toJS} from "mobx";
import ModelDetailModal from "./modelDetailModal";
import "./output.css";

@inject("outputStore")
@observer
class Output extends Component {
    render() {
        const {outputStore} = this.props,
            outputs = toJS(outputStore.getExecutionOutputs());

        return (
            <div>
                {outputs ? (
                    <div>
                        <div>
                            {outputs.map((output, i) => {
                                return [
                                    <div className="card" key={i}>
                                        <div className="card-header">
                                            {output.dataset.dataset_name}
                                        </div>
                                        <div className="card-body">
                                            <table className="table table-bordered hover">
                                                <thead>
                                                    <tr>
                                                        <th>Model</th>
                                                        <th>BMD</th>
                                                        <th>BMDL</th>
                                                        <th>BMDU</th>
                                                        <th>AIC</th>
                                                    </tr>
                                                </thead>
                                                <tbody key={i}>
                                                    {output.models.map((val, idx) => {
                                                        return [
                                                            <tr key={idx}>
                                                                <td
                                                                    className="td-modelName"
                                                                    onClick={() =>
                                                                        outputStore.toggleModelDetailModal(
                                                                            output,
                                                                            val.model_index
                                                                        )
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
                                        </div>
                                    </div>,
                                ];
                            })}
                        </div>
                        <div className="card">
                            <div className="card-header">Plot</div>
                            <div className="card-body"></div>
                        </div>
                        <div>
                            <div>{outputStore.modelDetailModal ? <ModelDetailModal /> : null}</div>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default Output;
