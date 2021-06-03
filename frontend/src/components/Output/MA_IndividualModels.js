import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {ff} from "../../common";

@observer
class MA_IndividualModels extends Component {
    render() {
        const {model, bayesian_models} = this.props;
        return (
            <table className="table table-bordered table-sm">
                <thead className="table-primary">
                    <tr>
                        <th colSpan="9">MA - Individual Models</th>
                    </tr>
                    <tr>
                        <th>Model</th>
                        <th>Prior Weights</th>
                        <th>Posterior Probability</th>
                        <th>BMD</th>
                        <th>BMDL</th>
                        <th>BMDU</th>
                    </tr>
                </thead>
                <tbody>
                    {bayesian_models.map((b_model, i) => {
                        return (
                            <tr key={i}>
                                <td>{b_model.name}</td>
                                <td>{ff(model.results.priors[i])}</td>
                                <td>{ff(model.results.posteriors[i])}</td>
                                <td>{ff(b_model.results.bmd)}</td>
                                <td>{ff(b_model.results.bmdu)}</td>
                                <td>{ff(b_model.results.bmdl)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
MA_IndividualModels.propTypes = {
    store: PropTypes.object,
    model: PropTypes.object,
    bayesian_models: PropTypes.array,
};
export default MA_IndividualModels;
