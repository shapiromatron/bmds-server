import _ from "lodash";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";
import {ff} from "utils/formatters";

import {modelClasses} from "../../../constants/outputConstants";

@inject("outputStore")
@observer
class ResultTable extends Component {
    render() {
        const store = this.props.outputStore,
            {selectedFrequentist} = store;

        if (!selectedFrequentist) {
            return null;
        }

        const colWidths = [11, 11, 11, 11, 11, 11, 11, 11, 11],
            {models} = selectedFrequentist;

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
                        <th>BMDL</th>
                        <th>BMD</th>
                        <th>BMDU</th>
                        <th>
                            <i>P</i>-Value
                        </th>
                        <th>AIC</th>
                        <th>Unnormalized Log Posterior Probability</th>
                        <th>Scaled Residual for Dose Group near BMD</th>
                        <th>Scaled Residual for Control Dose Group</th>
                    </tr>
                </thead>
                <tbody className="table-bordered">
                    {models.map((model, index) => (
                        <tr key={index}>
                            <td>
                                <a
                                    id={`freq-result-${index}`}
                                    href="#"
                                    onClick={e => {
                                        e.preventDefault();
                                        store.showModalDetail(modelClasses.frequentist, index);
                                    }}>
                                    {model.name}
                                </a>
                            </td>
                            <td>{ff(model.results.bmdl)}</td>
                            <td>{ff(model.results.bmd)}</td>
                            <td>{ff(model.results.bmdu)}</td>
                            <td>-9999</td>
                            <td>-9999</td>
                            <td>-9999</td>
                            <td>-9999</td>
                            <td>-9999</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}
ResultTable.propTypes = {
    outputStore: PropTypes.object,
};

export default ResultTable;
