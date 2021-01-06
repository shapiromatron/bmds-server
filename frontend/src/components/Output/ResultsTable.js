import React, {Component} from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import {inject, observer} from "mobx-react";

@inject("outputStore")
@observer
class ResultsTable extends Component {
    render() {
        const store = this.props.outputStore;
        return (
            <div className="table-responsive">
                <table className="table table-bordered  table-sm table-condensed">
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
                                    onMouseEnter={() => store.addBMDLine(model)}
                                    onMouseLeave={() => store.removeBMDLine()}
                                    className={
                                        store.getCurrentOutput.selected_model_index ==
                                        model.model_index
                                            ? "table-success"
                                            : null
                                    }>
                                    <td>
                                        <a
                                            href="#"
                                            onClick={e => {
                                                e.preventDefault();
                                                store.toggleModelDetailModal(model);
                                            }}>
                                            {model.model_name}
                                        </a>
                                    </td>
                                    <td>{_.round(model.results.bmd, 10)}</td>
                                    <td>{model.results.bmdl}</td>
                                    <td>{model.results.bmdu}</td>
                                    <td>{_.round(model.results.aic, 10)}</td>
                                    <td>{_.round(model.results.gof.p_value, 10)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}
ResultsTable.propTypes = {
    outputStore: PropTypes.object,
};
export default ResultsTable;
