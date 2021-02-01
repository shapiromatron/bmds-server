import {inject, observer} from "mobx-react";
import React, {Component} from "react";
import PropTypes from "prop-types";

import {getPValue} from "../../constants/outputConstants";
import {getModelBinLabel, getModelBinText} from "../../constants/logicConstants";
import {ff} from "../../common";

const getRecommenderText = function(output, index) {
    let items = getModelBinText(output, index);
    if (items.length === 0) {
        return null;
    }
    return (
        <ul className="list-unstyled">
            {items.map((d, idx) => (
                <li key={idx}>{d}</li>
            ))}
        </ul>
    );
};

@inject("outputStore")
@observer
class ResultsTable extends Component {
    render() {
        const store = this.props.outputStore,
            dataset = store.selectedDataset,
            {models} = store.selectedOutput,
            {model_index, notes} = store.selectedOutput.selected;

        return (
            <table className="table result table-sm">
                <thead className="table-bordered">
                    <tr className="table-primary">
                        <th>Model</th>
                        <th>BMD</th>
                        <th>BMDL</th>
                        <th>BMDU</th>
                        <th>AIC</th>
                        <th>p-value</th>
                        {store.recommendationEnabled ? (
                            <>
                                <th>Recommendation bin</th>
                                <th>Recommendation notes</th>
                            </>
                        ) : null}
                    </tr>
                </thead>
                <tbody className="table-bordered">
                    {models.map((model, idx) => {
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
                                <td>{ff(model.results.bmd)}</td>
                                <td>{ff(model.results.bmdl)}</td>
                                <td>{ff(model.results.bmdu)}</td>
                                <td>{ff(model.results.aic)}</td>
                                <td>{ff(getPValue(dataset.dtype, model.results))}</td>
                                {store.recommendationEnabled ? (
                                    <>
                                        <td>{getModelBinLabel(store.selectedOutput, idx)}</td>
                                        <td>{getRecommenderText(store.selectedOutput, idx)}</td>
                                    </>
                                ) : null}
                            </tr>
                        );
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
ResultsTable.propTypes = {
    outputStore: PropTypes.object,
};
export default ResultsTable;
