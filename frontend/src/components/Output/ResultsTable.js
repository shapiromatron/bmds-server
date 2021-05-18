import _ from "lodash";
import {inject, observer} from "mobx-react";
import React, {Component} from "react";
import PropTypes from "prop-types";

import {getPValue, priorClass} from "../../constants/outputConstants";
import {getModelBinLabel, getModelBinText} from "../../constants/logicConstants";
import {ff} from "../../common";

const getRecommenderText = function(output, index) {
    let items = getModelBinText(output, index);
    if (items.length === 0) {
        return null;
    }
    return (
        <ul className="list-unstyled mb-0">
            {items.map((d, idx) => (
                <li key={idx}>{d}</li>
            ))}
        </ul>
    );
};

@inject("outputStore")
@observer
class FrequentistResultTable extends Component {
    render() {
        const store = this.props.outputStore,
            dataset = store.selectedDataset,
            {selectedFrequentist} = store;

        if (!selectedFrequentist) {
            return null;
        }

        const {models} = selectedFrequentist,
            {model_index, notes} = selectedFrequentist.selected,
            numCols = store.recommendationEnabled ? 9 : 8,
            colWidths = store.recommendationEnabled
                ? [12, 10, 10, 10, 10, 10, 10, 10, 18]
                : [14, 10, 10, 10, 10, 10, 13, 13],
            renderRow = (model, idx) => {
                return (
                    <tr
                        key={idx}
                        onMouseEnter={() => store.drPlotAddHover(model)}
                        onMouseLeave={() => store.drPlotRemoveHover()}
                        className={model_index == idx ? "table-success" : ""}>
                        <td>
                            <a
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    store.showModalDetail(model);
                                }}>
                                {model.name}
                            </a>
                        </td>
                        <td>{ff(model.results.bmdl)}</td>
                        <td>{ff(model.results.bmd)}</td>
                        <td>{ff(model.results.bmdu)}</td>
                        <td>{ff(getPValue(dataset.dtype, model.results))}</td>
                        <td>{ff(model.results.fit.aic)}</td>
                        <td>{ff(-999)}</td>
                        <td>{ff(-999)}</td>
                        {store.recommendationEnabled ? (
                            <td>
                                <u>{getModelBinLabel(selectedFrequentist, idx)}</u>
                                <br />
                                {getRecommenderText(selectedFrequentist, idx)}
                            </td>
                        ) : null}
                    </tr>
                );
            };

        return (
            <table className="table table-sm">
                <colgroup>
                    {_.map(colWidths).map((value, idx) => (
                        <col key={idx} width={`${value}%`}></col>
                    ))}
                </colgroup>
                <thead className="table-bordered">
                    <tr className="table-primary">
                        <th>Model</th>
                        <th>BMDL</th>
                        <th>BMD</th>
                        <th>BMDU</th>
                        <th>P Value</th>
                        <th>AIC</th>
                        <th>Scaled Residual for Dose Group near BMD</th>
                        <th>Scaled Residual for Control Dose Group</th>
                        {store.recommendationEnabled ? <th>Recommendation and Notes</th> : null}
                    </tr>
                </thead>
                <tbody className="table-bordered">
                    <tr>
                        <td colSpan={numCols}>
                            <b>
                                <u>Restricted Models</u>
                            </b>
                        </td>
                    </tr>
                    {models.map((model, idx) => {
                        const {prior_class} = model.settings.priors;
                        if (prior_class != priorClass.frequentist_restricted) {
                            return null;
                        }
                        return renderRow(model, idx);
                    })}
                    <tr>
                        <td colSpan={numCols}>
                            <b>
                                <u>Unrestricted Models</u>
                            </b>
                        </td>
                    </tr>
                    {models.map((model, idx) => {
                        const {prior_class} = model.settings.priors;
                        if (prior_class != priorClass.frequentist_unrestricted) {
                            return null;
                        }
                        return renderRow(model, idx);
                    })}
                </tbody>
                {notes ? (
                    <tfoot>
                        <tr>
                            <td colSpan="7" className="text-muted">
                                {notes}
                            </td>
                        </tr>
                    </tfoot>
                ) : null}
            </table>
        );
    }
}
FrequentistResultTable.propTypes = {
    outputStore: PropTypes.object,
};

@inject("outputStore")
@observer
class BayesianResultTable extends Component {
    render() {
        const store = this.props.outputStore,
            dataset = store.selectedDataset,
            {selectedBayesian} = store;

        if (!selectedBayesian) {
            return null;
        }

        const colWidths = [14, 10, 10, 10, 10, 10, 10, 13, 13];

        return (
            <table className="table table-sm">
                <colgroup>
                    {_.map(colWidths).map((value, idx) => (
                        <col key={idx} width={`${value}%`}></col>
                    ))}
                </colgroup>
                <thead className="table-bordered">
                    <tr className="table-primary">
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
                    {selectedBayesian.models.map((model, idx) => {
                        return (
                            <tr key={idx}>
                                <td>
                                    <a
                                        href="#"
                                        onClick={e => {
                                            e.preventDefault();
                                            store.showModalDetail(model);
                                        }}>
                                        {model.name}
                                    </a>
                                </td>
                                <td>{ff(-999)}</td>
                                <td>{ff(-999)}</td>
                                <td>{ff(model.results.bmdl)}</td>
                                <td>{ff(model.results.bmd)}</td>
                                <td>{ff(model.results.bmdu)}</td>
                                <td>{ff(getPValue(dataset.dtype, model.results))}</td>
                                <td>{ff(-999)}</td>
                                <td>{ff(-999)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
BayesianResultTable.propTypes = {
    outputStore: PropTypes.object,
};

export {FrequentistResultTable, BayesianResultTable};
