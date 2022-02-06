import _ from "lodash";
import {toJS} from "mobx";
import {inject, observer} from "mobx-react";
import React, {Component} from "react";
import PropTypes from "prop-types";

import {MODEL_MULTI_TUMOR} from "../../constants/mainConstants";
import {BIN_LABELS} from "../../constants/logicConstants";
import {getPValue, modelClasses, priorClass} from "../../constants/outputConstants";
import {ff} from "../../common";
import Button from "../common/Button";

import Popover from "../common/Popover";

const getModelBinLabel = function(output, index) {
        if (output.recommender.results.recommended_model_index == index) {
            return `Recommended - ${output.recommender.results.recommended_model_variable.toUpperCase()}`;
        }
        return BIN_LABELS[output.recommender.results.model_bin[index]];
    },
    getModelBinText = function(output, index) {
        return _.chain(toJS(output.recommender.results.model_notes[index]))
            .values()
            .flattenDeep()
            .value();
    },
    getRecommenderText = function(output, index) {
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
    },
    getFootnotes = function(recommendedModelIndex, selected) {
        const icons = "*†‡§",
            fns = [];
        if (_.isNumber(recommendedModelIndex)) {
            fns.push({
                index: recommendedModelIndex,
                icon: icons[fns.length],
                text: "Recommended model",
                class: "table-info",
            });
        }
        if (_.isNumber(selected.model_index)) {
            fns.push({
                index: selected.model_index,
                icon: icons[fns.length],
                text: selected.notes,
                class: "table-success",
            });
        }
        return fns;
    },
    TableFootnotes = props => {
        const {items, colSpan} = props;
        if (items.length == 0) {
            return null;
        }
        return (
            <tfoot>
                <tr>
                    <td colSpan={colSpan} className="text-muted">
                        {
                            <ul className="list-unstyled text-muted mb-0">
                                {items.map((item, i) => (
                                    <li key={i}>
                                        {item.icon}&nbsp;{item.text}
                                    </li>
                                ))}
                            </ul>
                        }
                    </td>
                </tr>
            </tfoot>
        );
    };

TableFootnotes.propTypes = {
    items: PropTypes.array.isRequired,
    colSpan: PropTypes.number.isRequired,
};

@observer
class FrequentistRowSet extends Component {
    render() {
        const {store, dataset, selectedFrequentist, footnotes, models, label, colSpan} = this.props;
        if (models.length == 0) {
            return null;
        }
        return (
            <>
                <tr>
                    <td colSpan={colSpan}>
                        <b>
                            <u>{label}</u>
                        </b>
                    </td>
                </tr>
                {models.map(model => (
                    <FrequentistRow
                        key={model.index}
                        store={store}
                        dataset={dataset}
                        data={model}
                        selectedFrequentist={selectedFrequentist}
                        footnotes={footnotes}
                    />
                ))}
            </>
        );
    }
}
FrequentistRowSet.propTypes = {
    store: PropTypes.object.isRequired,
    selectedFrequentist: PropTypes.object.isRequired,
    footnotes: PropTypes.array.isRequired,
    models: PropTypes.array.isRequired,
    dataset: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    colSpan: PropTypes.number.isRequired,
};

@observer
class FrequentistRow extends Component {
    render() {
        const {store, data, dataset, selectedFrequentist, footnotes} = this.props,
            {name} = data.model,
            fns = footnotes.filter(d => d.index == data.index),
            rowClass = fns.length > 0 ? fns[fns.length - 1].class : "",
            rowIcon = fns.map(d => d.icon).join(""),
            popoverTitle = `${name}: ${getModelBinLabel(selectedFrequentist, data.index)}`,
            popoverContent =
                getModelBinText(selectedFrequentist, data.index)
                    .toString()
                    .split(",")
                    .join("<br/>") || "<i>No notes.</i>";

        return (
            <tr
                key={data.index}
                onMouseEnter={() => store.drPlotAddHover(data.model)}
                onMouseLeave={store.drPlotRemoveHover}
                className={rowClass}>
                <td>
                    <a
                        id={`freq-result-${data.index}`}
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            store.showModalDetail(modelClasses.frequentist, data.index);
                        }}>
                        {data.model.name}
                        {rowIcon}
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
                    store.showInlineNotes ? (
                        <td>
                            <u>{getModelBinLabel(selectedFrequentist, data.index)}</u>
                            <br />
                            {getRecommenderText(selectedFrequentist, data.index)}
                        </td>
                    ) : (
                        <Popover element="td" title={popoverTitle} content={popoverContent}>
                            <u>{getModelBinLabel(selectedFrequentist, data.index)}</u>
                        </Popover>
                    )
                ) : null}
            </tr>
        );
    }
}
FrequentistRow.propTypes = {
    store: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    dataset: PropTypes.object.isRequired,
    selectedFrequentist: PropTypes.object.isRequired,
    footnotes: PropTypes.array.isRequired,
};

@inject("outputStore")
@observer
class FrequentistResultTable extends Component {
    render() {
        const store = this.props.outputStore,
            dataset = store.selectedDataset,
            {selectedFrequentist} = store,
            modelType = store.getModelType;

        if (!selectedFrequentist) {
            return null;
        }

        if (modelType === MODEL_MULTI_TUMOR) {
            return <p>TODO - nested dichotomous.</p>;
        }

        const {models} = selectedFrequentist,
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
            recommendedModelIndex = selectedFrequentist.recommender.results.recommended_model_index,
            footnotes = getFootnotes(recommendedModelIndex, selectedFrequentist.selected);

        return (
            <table id="frequentist-model-result" className="table table-sm">
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
                        <th>P Value</th>
                        <th>AIC</th>
                        <th>Scaled Residual for Dose Group near BMD</th>
                        <th>Scaled Residual for Control Dose Group</th>
                        {store.recommendationEnabled ? (
                            <th>
                                <Button
                                    title="Toggle showing notes inline or popover"
                                    className="btn btn-info btn-sm pull-right"
                                    onClick={store.toggleInlineNotes}
                                    text={store.showInlineNotes ? "Hide" : "Show"}
                                    faClass={`fa fa-fw ${
                                        store.showInlineNotes ? "fa-eye-slash" : "fa-eye"
                                    }`}
                                />
                                Recommendation
                                <br />
                                and Notes
                            </th>
                        ) : null}
                    </tr>
                </thead>
                <tbody className="table-bordered">
                    <FrequentistRowSet
                        store={store}
                        colSpan={numCols}
                        label={"Restricted Models"}
                        dataset={dataset}
                        models={restrictedModels}
                        selectedFrequentist={selectedFrequentist}
                        footnotes={footnotes}
                    />
                    <FrequentistRowSet
                        store={store}
                        colSpan={numCols}
                        label={"Unrestricted Models"}
                        dataset={dataset}
                        models={unrestrictedModels}
                        selectedFrequentist={selectedFrequentist}
                        footnotes={footnotes}
                    />
                </tbody>
                <TableFootnotes items={footnotes} colSpan={numCols} />
            </table>
        );
    }
}
FrequentistResultTable.propTypes = {
    outputStore: PropTypes.object,
};

export default FrequentistResultTable;
