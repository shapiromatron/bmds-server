import _ from "lodash";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

@observer
class GoodnessOfFit extends Component {
    render() {
        const gof = this.props.model.gof,
            temp_rslt_len = _.size(gof.eb_lower);
        return (
            <table className="table table-sm table-bordered">
                <thead>
                    <tr className="bg-custom">
                        <th colSpan="6">Goodness Of Fit</th>
                    </tr>
                    <tr>
                        <th>Dose</th>
                        <th>Size</th>
                        <th>Observed</th>
                        <th>Expected</th>
                        <th>Est Prob</th>
                        <th>Scaled Residual</th>
                    </tr>
                </thead>
                <tbody>
                    {_.range(temp_rslt_len).map(i => {
                        return (
                            <tr key={i}>
                                <td>{1}</td>
                                <td>{1}</td>
                                <td>{1}</td>
                                <td>{gof.expected[i]}</td>
                                <td>{1}</td>
                                <td>{gof.residual[i]}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
GoodnessOfFit.propTypes = {
    model: PropTypes.object,
};

export default GoodnessOfFit;
