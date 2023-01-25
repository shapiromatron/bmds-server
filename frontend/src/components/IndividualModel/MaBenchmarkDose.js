import {observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

import {ff} from "@/utils/formatters";

@observer
class MaBenchmarkDose extends Component {
    render() {
        const {results} = this.props;
        return (
            <table id="ma-result-summary" className="table table-sm table-bordered col-r-2">
                <colgroup>
                    <col width="60%" />
                    <col width="40%" />
                </colgroup>
                <thead>
                    <tr className="bg-custom">
                        <th colSpan="2">Summary</th>
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
                </tbody>
            </table>
        );
    }
}
MaBenchmarkDose.propTypes = {
    results: PropTypes.object.isRequired,
};
export default MaBenchmarkDose;
