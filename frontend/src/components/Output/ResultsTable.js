import React, {Component} from "react";
import PropTypes from "prop-types";

import {inject, observer} from "mobx-react";

@inject("outputStore")
@observer
class ResultsTable extends Component {
    render() {
        const store = this.props.outputStore;
        return (
            <table className="table table-bordered result table-sm">
                <thead>
                    <tr className="table-primary">
                        <th>Model</th>
                        <th>BMD</th>
                        <th>BMDL</th>
                        <th>BMDU</th>
                        <th>AIC</th>
                        <th>p-value</th>
                    </tr>
                </thead>
                <tbody>
                    {store.getCurrentOutput.models.map((model, idx) => {
                        return (
                            <tr
                                key={idx}
                                onMouseOver={e => {
                                    store.setSelectedModel(model);
                                    store.addBMDLine(model);
                                }}
                                onMouseOut={e => store.removeBMDLine()}>
                                <td className="button">
                                    <button
                                        onClick={e => store.toggleModelDetailModal(model)}
                                        className="btn btn-sm btn-link">
                                        {model.model_name}
                                    </button>
                                </td>
                                <td>{model.results.bmd}</td>
                                <td>{model.results.bmdl}</td>
                                <td>{model.results.bmdu}</td>
                                <td>{model.results.aic}</td>
                                <td>{model.results.gof.p_value}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
ResultsTable.propTypes = {
    outputStore: PropTypes.object,
};
export default ResultsTable;
