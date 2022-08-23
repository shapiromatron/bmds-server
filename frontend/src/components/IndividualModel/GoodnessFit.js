import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {ff} from "utils/formatters";
import {Dtype} from "../../constants/dataConstants";
import {isLognormal} from "../../constants/modelConstants";

/* eslint-disable */
const hdr_c_normal = [
        "Dose", "Size", "Observed Mean", "Calculated Median", "Estimated Median",
        "Observed SD", "Calculated SD", "Estimated SD", "Scaled Residual",
    ],
    hdr_c_lognormal = [
        "Dose", "Size", "Observed Mean", "Calculated Median", "Estimated Median",
        "Observed GSD", "Calculated GSD", "Estimated GSD", "Scaled Residual",
    ],
    hdr_d = [ "Dose", "Size", "Observed", "Expected", "Estimated Probability", "Scaled Residual"];
/* eslint-enable */

@observer
class GoodnessFit extends Component {
    getHeaders(dtype, settings) {
        if (dtype == Dtype.CONTINUOUS || dtype == Dtype.CONTINUOUS_INDIVIDUAL) {
            const headers = isLognormal(settings.disttype) ? hdr_c_lognormal : hdr_c_normal;
            return [headers, [10, 10, 10, 12, 12, 12, 10, 12, 12]];
        }
        if (dtype == Dtype.DICHOTOMOUS) {
            return [hdr_d, [17, 16, 16, 17, 17, 17]];
        }
        throw Error("Unknown dtype");
    }
    render() {
        const {store} = this.props,
            settings = store.modalModel.settings,
            gof = store.modalModel.results.gof,
            dataset = store.selectedDataset,
            {dtype} = dataset,
            headers = this.getHeaders(dtype, settings);
        return (
            <table className="table table-sm table-bordered text-right">
                <colgroup>
                    {headers[1].map((d, i) => (
                        <col key={i} width={`${d}%`} />
                    ))}
                </colgroup>
                <thead>
                    <tr className="bg-custom text-left">
                        <th colSpan={headers[0].length}>Goodness of Fit</th>
                    </tr>
                    <tr>
                        {headers[0].map((d, i) => (
                            <th key={i}>{d}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {dtype == Dtype.CONTINUOUS || dtype == Dtype.CONTINUOUS_INDIVIDUAL
                        ? gof.dose.map((item, i) => {
                              const useFF = dtype === Dtype.CONTINUOUS_INDIVIDUAL;
                              return (
                                  <tr key={i}>
                                      <td>{item}</td>
                                      <td>{gof.size[i]}</td>
                                      <td>{useFF ? ff(gof.obs_mean[i]) : gof.obs_mean[i]}</td>
                                      <td>{ff(gof.calc_mean[i])}</td>
                                      <td>{ff(gof.est_mean[i])}</td>
                                      <td>{useFF ? ff(gof.obs_sd[i]) : gof.obs_sd[i]}</td>
                                      <td>{ff(gof.calc_sd[i])}</td>
                                      <td>{ff(gof.est_sd[i])}</td>
                                      <td>{ff(gof.residual[i])}</td>
                                  </tr>
                              );
                          })
                        : null}
                    {dtype == Dtype.DICHOTOMOUS
                        ? dataset.doses.map((dose, i) => {
                              return (
                                  <tr key={i}>
                                      <td>{dose}</td>
                                      <td>{dataset.ns[i]}</td>
                                      <td>{dataset.incidences[i]}</td>
                                      <td>{ff(gof.expected[i])}</td>
                                      <td>{ff(gof.expected[i] / dataset.ns[i])}</td>
                                      <td>{ff(gof.residual[i])}</td>
                                  </tr>
                              );
                          })
                        : null}
                </tbody>
            </table>
        );
    }
}
GoodnessFit.propTypes = {
    store: PropTypes.object,
};
export default GoodnessFit;
