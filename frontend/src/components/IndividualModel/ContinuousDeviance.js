import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {ff} from "utils/formatters";

@observer
class ContinuousDeviance extends Component {
    render() {
        const {store} = this.props,
            deviances = store.modalModel.results.deviance;

        return (
            <table className="table table-sm table-bordered text-right col-l-1">
                <thead>
                    <tr className="bg-custom">
                        <th colSpan="9">Analysis of Deviance</th>
                    </tr>
                    <tr>
                        <th>Name</th>
                        <th>Loglikelihood</th>
                        <th>Num Params</th>
                        <th>AIC</th>
                    </tr>
                </thead>
                <tbody>
                    {deviances.names.map((name, i) => {
                        return (
                            <tr key={i}>
                                <td>{name}</td>
                                <td>{ff(deviances.loglikelihoods[i])}</td>
                                <td>{deviances.num_params[i]}</td>
                                <td>{ff(deviances.aics[i])}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
ContinuousDeviance.propTypes = {
    store: PropTypes.object,
};
export default ContinuousDeviance;
