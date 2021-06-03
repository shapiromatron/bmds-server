import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {ff} from "../../common";

@observer
class BenchmarkDose extends Component {
    render() {
        const {model} = this.props;
        return (
            <table className="table table-bordered table-sm">
                <thead>
                    <tr className="table-primary">
                        <th colSpan="2">Benchmark Summary</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>BMD</td>
                        <td>{ff(model.results.bmd)}</td>
                    </tr>
                    <tr>
                        <td>BMDL</td>
                        <td>{ff(model.results.bmdl)}</td>
                    </tr>
                    <tr>
                        <td>BMDU</td>
                        <td>{ff(model.results.bmdu)}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
BenchmarkDose.propTypes = {
    store: PropTypes.object,
    model: PropTypes.object,
};
export default BenchmarkDose;
