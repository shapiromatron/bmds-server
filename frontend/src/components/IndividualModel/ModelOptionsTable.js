import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import {priorClassLabels} from "../../constants/outputConstants";
import {Dtype} from "../../constants/dataConstants";
import {
    dichotomousBmrOptions,
    continuousBmrOptions,
    distTypeOptions,
} from "../../constants/optionsConstants";
import {ff, getLabel} from "../../common";

@observer
class ModelOptionsTable extends Component {
    render() {
        const {dtype, model} = this.props;

        return (
            <table className="table table-bordered table-sm">
                <thead>
                    <tr className="bg-custom">
                        <th colSpan="2">Model Options</th>
                    </tr>
                </thead>
                <tbody>
                    {dtype == Dtype.DICHOTOMOUS ? (
                        <>
                            <tr>
                                <td>BMR Type</td>
                                <td>{getLabel(model.settings.bmr_type, dichotomousBmrOptions)}</td>
                            </tr>
                            <tr>
                                <td>BMR</td>
                                <td>{ff(model.settings.bmr)}</td>
                            </tr>
                            <tr>
                                <td>Alpha</td>
                                <td>{ff(model.settings.alpha)}</td>
                            </tr>
                            <tr>
                                <td>Degree</td>
                                <td>{ff(model.settings.degree)}</td>
                            </tr>
                            <tr>
                                <td>Samples</td>
                                <td>{ff(model.settings.samples)}</td>
                            </tr>
                            <tr>
                                <td>Burn In</td>
                                <td>{ff(model.settings.burnin)}</td>
                            </tr>
                            <tr>
                                <td>Prior Class</td>
                                <td>
                                    {getLabel(model.settings.priors.prior_class, priorClassLabels)}
                                </td>
                            </tr>
                        </>
                    ) : null}
                    {dtype == Dtype.CONTINUOUS || dtype == Dtype.CONTINUOUS_INDIVIDUAL ? (
                        <>
                            <tr>
                                <td>Is increasing</td>
                                <td>{model.settings.is_increasing}</td>
                            </tr>
                            <tr>
                                <td>Distribution Type</td>
                                <td>{getLabel(model.settings.disttype, distTypeOptions)}</td>
                            </tr>
                            <tr>
                                <td>BMR Type</td>
                                <td>{getLabel(model.settings.bmr_type, continuousBmrOptions)}</td>
                            </tr>
                            <tr>
                                <td>BMRF</td>
                                <td>{ff(model.settings.bmr)}</td>
                            </tr>
                            <tr>
                                <td>Tail Probability</td>
                                <td>{ff(model.settings.tail_prob)}</td>
                            </tr>
                            <tr>
                                <td>Alpha</td>
                                <td>{ff(model.settings.alpha)}</td>
                            </tr>
                            <tr>
                                <td>Degree</td>
                                <td>{ff(model.settings.degree)}</td>
                            </tr>
                            <tr>
                                <td>Samples</td>
                                <td>{model.settings.samples}</td>
                            </tr>
                            <tr>
                                <td>Burn in</td>
                                <td>{model.settings.burnin}</td>
                            </tr>
                            <tr>
                                <td>Prior class</td>
                                <td>
                                    {getLabel(model.settings.priors.prior_class, priorClassLabels)}
                                </td>
                            </tr>
                        </>
                    ) : null}
                </tbody>
            </table>
        );
    }
}
ModelOptionsTable.propTypes = {
    dtype: PropTypes.string.isRequired,
    model: PropTypes.object.isRequired,
};
export default ModelOptionsTable;
