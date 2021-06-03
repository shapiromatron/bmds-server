import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {ff} from "../../common";

@observer
class MaBenchmarkDose extends Component {
    render() {
        const {results} = this.props;
        return (
            <table className="table table-bordered table-sm">
                <thead>
                    <tr className="table-primary">
                        <th colSpan="2">Benchmark Summary</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>BMDL</td>
                        <td>{ff(results.bmdl)}</td>
                    </tr>
                    <tr>
                        <td>BMD</td>
                        <td>{ff(results.bmd)}</td>
                    </tr>
                    <tr>
                        <td>BMDU</td>
                        <td>{ff(results.bmdu)}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
MaBenchmarkDose.propTypes = {
    results: PropTypes.object.isRequired,
};
export default MaBenchmarkDose;
