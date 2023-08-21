import {toJS} from "mobx";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

import {ff} from "@/utils/formatters";

@observer
class BootstrapResult extends Component {
    render() {
        console.log(toJS(this.props.model));
        return (
            <table className="table table-sm table-bordered">
                <thead className="bg-custom">
                    <tr>
                        <th colSpan="2">Bootstrap Results</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th># Iterations</th>
                        <td>{1}</td>
                    </tr>
                    <tr>
                        <th>Bootstrap Seed</th>
                        <td>{1}</td>
                    </tr>
                    <tr>
                        <th>Log-likelihood</th>
                        <td>{ff(this.props.model.results.ll)}</td>
                    </tr>
                    <tr>
                        <th>Observed Chi-square</th>
                        <td>{ff(this.props.model.results.summary.chi_squared)}</td>
                    </tr>
                    <tr>
                        <th>
                            Combined <i>P</i>-Value
                        </th>
                        <td>{1}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
BootstrapResult.propTypes = {
    model: PropTypes.object,
};

export default BootstrapResult;
