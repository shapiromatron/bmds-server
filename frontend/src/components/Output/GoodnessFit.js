import _ from "lodash";
import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {model_type} from "../../constants/dataConstants";

const continuousRow = function(row, index) {
        return (
            <tr key={index}>
                <td>{row.dose}</td>
                <td>{row.obs_mean}</td>
                <td>{row.obs_stdev}</td>
                <td>{row.calc_median}</td>
                <td>{row.calc_gsd}</td>
                <td>{row.est_mean}</td>
                <td>{row.est_stdev}</td>
                <td>{row.size}</td>
                <td>{row.scaled_residual}</td>
            </tr>
        );
    },
    dichotomousRow = function(row, index) {
        return (
            <tr key={index}>
                <td>{row.dose}</td>
                <td>{row.est_prob}</td>
                <td>{row.expected}</td>
                <td>{row.observed}</td>
                <td>{row.size}</td>
                <td>{row.scaled_residual}</td>
            </tr>
        );
    },
    getRows = function(output, model) {
        if (output.dataset.model_type === model_type.Continuous_Summarized) {
            // TODO - fix
            return output.results.gof;
        } else if (output.dataset.model_type === model_type.Dichotomous) {
            return _.zip(
                output.dataset.doses,
                output.dataset.ns,
                model.results.gof.expected,
                model.results.gof.residual
            ).map(d => {
                return {
                    dose: d[0],
                    est_prob: d[2],
                    expected: d[2],
                    observed: d[2],
                    size: d[1],
                    scaled_residual: d[3],
                };
            });
        } else {
            throw `Unknown model type ${output.dataset.model_type}`;
        }
    },
    getRowFunc = function(output) {
        if (output.dataset.model_type === model_type.Continuous_Summarized) {
            return continuousRow;
        } else if (output.dataset.model_type === model_type.Dichotomous) {
            return dichotomousRow;
        } else {
            throw `Unknown model type ${model_type}`;
        }
    },
    goodnessFitHeaders = {
        [model_type.Continuous_Summarized]: [
            "Dose",
            "Observed Mean",
            "Observed SD",
            "Calculated Median",
            "Calculated SD",
            "Estimated Median",
            "Estimated SD",
            "Size",
            "Scaled Residual",
        ],
        [model_type.Dichotomous]: [
            "Dose",
            "Estimated probability",
            "Expected",
            "Observed",
            "Size",
            "Scaled Residual",
        ],
    };

@observer
class GoodnessFit extends Component {
    render() {
        const {store} = this.props,
            output = store.getCurrentOutput,
            model = store.selectedModel,
            headers = goodnessFitHeaders[output.dataset.model_type],
            rows = getRows(output, model),
            rowFunc = getRowFunc(output);

        return (
            <table className="table table-bordered table-sm">
                <thead className="table-primary">
                    <tr>
                        <th colSpan="9">Goodness of Fit</th>
                    </tr>
                    <tr>
                        {headers.map(header => (
                            <th key={header}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>{rows.map(rowFunc)}</tbody>
            </table>
        );
    }
}
GoodnessFit.propTypes = {
    store: PropTypes.object,
};
export default GoodnessFit;
