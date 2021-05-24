import _ from "lodash";
import {inject, observer} from "mobx-react";
import React, {Component} from "react";
import PropTypes from "prop-types";

import {maIndex, getPValue, modelClasses, priorClass} from "../../constants/outputConstants";
import {getModelBinLabel, getModelBinText} from "../../constants/logicConstants";
import {ff} from "../../common";

const getRecommenderText = function(output, index) {
    let items = getModelBinText(output, index);
    if (items.length === 0) {
        return null;
    }
    return (
        <ul className="list-unstyled text-muted mb-0">
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
            restrictedModels = _.chain(models)
                .map((model, index) => {
                    if (model.settings.priors.prior_class === priorClass.frequentist_restricted) {
                        return {model, index};
                    }
                    return null;
                })
                .compact()
                .value(),
            unrestrictedModels = _.chain(models)
                .map((model, index) => {
                    if (model.settings.priors.prior_class === priorClass.frequentist_unrestricted) {
                        return {model, index};
                    }
                    return null;
                })
                .compact()
                .value(),
            numCols = store.recommendationEnabled ? 9 : 8,
            colWidths = store.recommendationEnabled
                ? [12, 8, 8, 8, 8, 8, 10, 10, 28]
                : [20, 10, 10, 10, 10, 10, 15, 15],
            renderRow = data => {
                return (
                    <tr
                        key={data.index}
                        onMouseEnter={() => store.drPlotAddHover(data.model)}
                        onMouseLeave={() => store.drPlotRemoveHover()}
                        className={model_index == data.index ? "table-success" : ""}>
                        <td>
                            <a
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    store.showModalDetail(modelClasses.frequentist, data.index);
                                }}>
                                {data.model.name}
                            </a>
                        </td>
                        <td>{ff(data.model.results.bmdl)}</td>
                        <td>{ff(data.model.results.bmd)}</td>
                        <td>{ff(data.model.results.bmdu)}</td>
                        <td>{ff(getPValue(dataset.dtype, data.model.results))}</td>
                        <td>{ff(data.model.results.fit.aic)}</td>
                        <td>{ff(data.model.results.gof.roi)}</td>
                        <td>{ff(data.model.results.gof.residual[0])}</td>
                        {store.recommendationEnabled ? (
                            <td>
                                <u>{getModelBinLabel(selectedFrequentist, data.index)}</u>
                                <br />
                                {getRecommenderText(selectedFrequentist, data.index)}
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
                    {restrictedModels.length > 0 ? (
                        <>
                            <tr>
                                <td colSpan={numCols}>
                                    <b>
                                        <u>Restricted Models</u>
                                    </b>
                                </td>
                            </tr>
                            {restrictedModels.map(renderRow)}
                        </>
                    ) : null}
                    {unrestrictedModels.length > 0 ? (
                        <>
                            <tr>
                                <td colSpan={numCols}>
                                    <b>
                                        <u>Unrestricted Models</u>
                                    </b>
                                </td>
                            </tr>
                            {unrestrictedModels.map(renderRow)}
                        </>
                    ) : null}
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

export {FrequentistResultTable, BayesianResultTable};
