import _ from "lodash";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

import {ff} from "@/utils/formatters";

@inject("outputStore")
@observer
class ResultTable extends Component {
    render() {
        const store = this.props.outputStore,
            {selectedFrequentist} = store;

        if (!selectedFrequentist) {
            return null;
        }
        const colWidths = [15, 15, 10, 10, 10, 10, 10],
            {results} = selectedFrequentist,
            {selectedMultitumorModels, multitumorDatasets} = store,
            indexes = results.selected_model_indexes;

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
                        <th>Dataset</th>
                        <th>BMDL</th>
                        <th>BMD</th>
                        <th>BMDU</th>
                        <th>
                            <i>P</i>-Value
                        </th>
                        <th>AIC</th>
                    </tr>
                </thead>
                <tbody className="table-bordered">
                    <tr key={-1}>
                        <td>
                            <a
                                id={`freq-result-${-1}`}
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    store.showModalDetailMultitumor(-1, -1);
                                }}>
                                Multi-tumor (MS Combo)
                            </a>
                        </td>
                        <td>-</td>
                        <td>{ff(results.bmdl)}</td>
                        <td>{ff(results.bmd)}</td>
                        <td>{ff(results.bmdu)}</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    {selectedMultitumorModels.map((model, index) => {
                        const degree = model.parameters.names.length - 1,
                            name = `Multistage ${degree}°`,
                            dataset = multitumorDatasets[index];
                        return (
                            <tr key={index}>
                                <td>
                                    <a
                                        id={`freq-result-${index}`}
                                        href="#"
                                        onClick={e => {
                                            e.preventDefault();
                                            store.showModalDetailMultitumor(index, indexes[index]);
                                        }}>
                                        {name}
                                    </a>
                                </td>
                                <td>{dataset.metadata.name}</td>
                                <td>{ff(model.bmdl)}</td>
                                <td>{ff(model.bmd)}</td>
                                <td>{ff(model.bmdu)}</td>
                                <td>{ff(model.gof.p_value)}</td>
                                <td>{ff(model.fit.aic)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
ResultTable.propTypes = {
    outputStore: PropTypes.object,
};

export default ResultTable;
