import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {ff} from "../../common";

@observer
class MaIndividualModels extends Component {
    render() {
        const {model_average, models} = this.props;
        return (
            <table className="table table-bordered table-sm">
                <colgroup>
                    <col width="25%" />
                    <col width="15%" />
                    <col width="15%" />
                    <col width="15%" />
                    <col width="15%" />
                    <col width="15%" />
                </colgroup>
                <thead>
                    <tr className="table-primary">
                        <th colSpan="6">Individual Model Results</th>
                    </tr>
                    <tr>
                        <th>Model</th>
                        <th>Prior Weights</th>
                        <th>Posterior Probability</th>
                        <th>BMDL</th>
                        <th>BMD</th>
                        <th>BMDU</th>
                    </tr>
                </thead>
                <tbody>
                    {models.map((model, i) => {
                        return (
                            <tr key={i}>
                                <td>{model.name}</td>
                                <td>{ff(model_average.results.priors[i])}</td>
                                <td>{ff(model_average.results.posteriors[i])}</td>
                                <td>{ff(model.results.bmdl)}</td>
                                <td>{ff(model.results.bmd)}</td>
                                <td>{ff(model.results.bmdu)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
MaIndividualModels.propTypes = {
    model_average: PropTypes.object.isRequired,
    models: PropTypes.array.isRequired,
};
export default MaIndividualModels;
