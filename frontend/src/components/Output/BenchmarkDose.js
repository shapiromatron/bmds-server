import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {getPValue} from "../../constants/outputConstants";
import {ff} from "../../common";

@observer
class BenchmarkDose extends Component {
    render() {
        const {store} = this.props,
            dataset = store.selectedDataset,
            results = store.modalModel.results;

        return (
            <table className="table table-bordered table-sm">
                <thead>
                    <tr className="table-primary">
                        <th colSpan="2">Benchmark Dose</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>BMD</td>
                        <td>{ff(results.bmd)}</td>
                    </tr>
                    <tr>
                        <td>BMDL</td>
                        <td>{ff(results.bmdl)}</td>
                    </tr>
                    <tr>
                        <td>BMDU</td>
                        <td>{ff(results.bmdu)}</td>
                    </tr>
                    <tr>
                        <td>AIC</td>
                        <td>{ff(results.aic)}</td>
                    </tr>
                    <tr>
                        <td>P Value</td>
                        <td>{ff(getPValue(dataset.dtype, results))}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

BenchmarkDose.propTypes = {
    store: PropTypes.object,
};

export default BenchmarkDose;
