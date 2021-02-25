import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {ff} from "../../common";
import {Dtype} from "../../constants/dataConstants";

@observer
class GoodnessFit extends Component {
    render() {
        const {store} = this.props,
            gof = store.modalModel.results.gof,
            dataset = store.selectedDataset,
            dtype = store.selectedOutput.dataset.dtype;
        return (
            <table className="table table-bordered table-sm">
                <thead className="table-primary">
                    <tr>
                        <th colSpan="9">Goodness of Fit</th>
                    </tr>
                    <tr>
                        <th>Dose</th>
                        <th>Est. Prob</th>
                        <th>Expected</th>
                        <th>Observed</th>
                        <th>Size</th>
                        <th>Scaled Res.</th>
                    </tr>
                </thead>
                <tbody>
                    {dtype == Dtype.CONTINUOUS
                        ? gof.dose.map((item, i) => {
                              return (
                                  <tr key={i}>
                                      <td>{item}</td>
                                      <td>{ff(gof.est_mean[i])}</td>
                                      <td>{ff(gof.calc_mean[i])}</td>
                                      <td>{gof.obs_mean[i]}</td>
                                      <td>{gof.size[i]}</td>
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
                                      <td>{ff(gof.expected[i] / dataset.ns[i])}</td>
                                      <td>{ff(gof.expected[i])}</td>
                                      <td>{dataset.incidences[i]}</td>
                                      <td>{dataset.ns[i]}</td>
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
