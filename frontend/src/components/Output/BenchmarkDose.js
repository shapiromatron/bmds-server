import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {getPValue} from "../../constants/outputConstants";

@observer
class BenchmarkDose extends Component {
    render() {
        const {store} = this.props,
            dataset = store.selectedDataset,
            results = store.selectedModel.results;

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
                        <td>{results.bmd}</td>
                    </tr>
                    <tr>
                        <td>BMDL</td>
                        <td>{results.bmdl}</td>
                    </tr>
                    <tr>
                        <td>BMDU</td>
                        <td>{results.bmdu}</td>
                    </tr>
                    <tr>
                        <td>AIC</td>
                        <td>{results.aic}</td>
                    </tr>
                    <tr>
                        <td>P Value</td>
                        <td>{getPValue(dataset.model_type, results)}</td>
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
