import _ from "lodash";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

import {getNameFromDegrees} from "@/constants/modelConstants";
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
        const colWidths = [15, 15, 8, 8, 8, 8, 8, 8, 11, 11],
            {results} = selectedFrequentist,
            {multitumorDatasets} = store,
            indexes = results.selected_model_indexes,
            showMultitumor = store.multitumorDatasets.length > 1;

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
                        <th>CSF</th>
                        <th>
                            <i>P</i>-Value
                        </th>
                        <th>AIC</th>
                        <th>Scaled Residual for Dose Group near BMD</th>
                        <th>Scaled Residual for Control Dose Group</th>
                    </tr>
                </thead>
                <tbody className="table-bordered">
                    {showMultitumor ? (
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
                            <td>{ff(results.slope_factor)}</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    ) : null}
                    {results.models.map((dataset_models, dataset_index) => {
                        const dataset = multitumorDatasets[dataset_index],
                            rows = _.flatten(
                                dataset_models.map((model, model_index) => {
                                    const key = `${dataset_index}-${model_index}`,
                                        name = getNameFromDegrees(model),
                                        selected = indexes[dataset_index] === model_index;
                                    return (
                                        <tr key={key} className={selected ? "table-info" : ""}>
                                            <td>
                                                <a
                                                    id={key}
                                                    href="#"
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        store.showModalDetailMultitumor(
                                                            dataset_index,
                                                            model_index
                                                        );
                                                    }}>
                                                    {name}
                                                    {selected ? "*" : ""}
                                                </a>
                                            </td>
                                            <td>{dataset.metadata.name}</td>
                                            <td>{ff(model.bmdl)}</td>
                                            <td>{ff(model.bmd)}</td>
                                            <td>{ff(model.bmdu)}</td>
                                            <td>TODO</td>
                                            <td>{ff(model.gof.p_value)}</td>
                                            <td>{ff(model.fit.aic)}</td>
                                            <td>{ff(model.gof.roi)}</td>
                                            <td>{ff(model.gof.residual[0])}</td>
                                        </tr>
                                    );
                                })
                            );
                        return rows;
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={8} className="text-muted">
                            {
                                <ul className="list-unstyled text-muted mb-0">
                                    <li>
                                        {showMultitumor
                                            ? "* Selected model is included in MS Combo model."
                                            : "* Recommended best fitting model."}
                                    </li>
                                </ul>
                            }
                        </td>
                    </tr>
                </tfoot>
            </table>
        );
    }
}
ResultTable.propTypes = {
    outputStore: PropTypes.object,
};

export default ResultTable;
