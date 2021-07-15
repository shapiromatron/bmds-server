import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

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
                                <td>Risk Type</td>
                                <td>{getLabel(model.settings.bmr_type, dichotomousBmrOptions)}</td>
                            </tr>
                            <tr>
                                <td>BMR</td>
                                <td>{ff(model.settings.bmr)}</td>
                            </tr>
                            <tr>
                                <td>Confidence Level</td>
                                <td>{ff(1 - model.settings.alpha)}</td>
                            </tr>
                        </>
                    ) : null}
                    {dtype == Dtype.CONTINUOUS || dtype == Dtype.CONTINUOUS_INDIVIDUAL ? (
                        <>
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
                                <td>Confidence Level</td>
                                <td>{ff(1 - model.settings.alpha)}</td>
                            </tr>
                            <tr>
                                <td>Distribution + Variance</td>
                                <td>{getLabel(model.settings.disttype, distTypeOptions)}</td>
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
