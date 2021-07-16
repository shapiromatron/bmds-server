import _ from "lodash";
import {inject, observer} from "mobx-react";
import React, {Component} from "react";
import PropTypes from "prop-types";

import {maIndex, modelClasses} from "../../constants/outputConstants";
import {ff} from "../../common";

@inject("outputStore")
@observer
class BayesianResultTable extends Component {
    render() {
        const store = this.props.outputStore,
            {selectedBayesian} = store;

        if (!selectedBayesian) {
            return null;
        }

        const colWidths = [14, 10, 10, 10, 10, 10, 10, 13, 13],
            ma = selectedBayesian.model_average;

        return (
            <table className="table table-sm">
                <colgroup>
                    {_.map(colWidths).map((value, idx) => (
                        <col key={idx} width={`${value}%`}></col>
                    ))}
                </colgroup>
                <thead className="table-bordered">
                    <tr className="bg-custom">
                        <th>Model</th>
                        <th>Prior Weights</th>
                        <th>Posterior Weights</th>
                        <th>BMDL</th>
                        <th>BMD</th>
                        <th>BMDU</th>
                        <th>P Value</th>
                        <th>Scaled Residual for Dose Group near BMD</th>
                        <th>Scaled Residual for Control Dose Group</th>
                    </tr>
                </thead>
                <tbody className="table-bordered">
                    {selectedBayesian.models.map((model, index) => {
                        return (
                            <tr key={index}>
                                <td>
                                    <a
                                        href="#"
                                        onClick={e => {
                                            e.preventDefault();
                                            store.showModalDetail(modelClasses.bayesian, index);
                                        }}>
                                        {model.name}
                                    </a>
                                </td>
                                <td>{ma ? ff(ma.results.priors[index]) : "-"}</td>
                                <td>{ma ? ff(ma.results.posteriors[index]) : "-"}</td>
                                <td>{ff(model.results.bmdl)}</td>
                                <td>{ff(model.results.bmd)}</td>
                                <td>{ff(model.results.bmdu)}</td>
                                <td>-</td>
                                <td>{ff(model.results.gof.roi)}</td>
                                <td>{ff(model.results.gof.residual[0])}</td>
                            </tr>
                        );
                    })}
                    {ma ? (
                        <tr className="table-warning">
                            <td>
                                <a
                                    href="#"
                                    onClick={e => {
                                        e.preventDefault();
                                        store.showModalDetail(modelClasses.bayesian, maIndex);
                                    }}>
                                    Model Average
                                </a>
                            </td>
                            <td>-</td>
                            <td>-</td>
                            <td>{ff(ma.results.bmdl)}</td>
                            <td>{ff(ma.results.bmd)}</td>
                            <td>{ff(ma.results.bmdu)}</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    ) : null}
                </tbody>
            </table>
        );
    }
}
BayesianResultTable.propTypes = {
    outputStore: PropTypes.object,
};

export default BayesianResultTable;