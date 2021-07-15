import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {Dtype} from "../../constants/dataConstants";

@observer
class ModelData extends Component {
    render() {
        const {dtype, dataset} = this.props;
        return (
            <table className="table table-bordered table-sm">
                <thead>
                    <tr className="bg-custom">
                        <th colSpan="2">Model Data</th>
                    </tr>
                </thead>
                <tbody>
                    {dtype == Dtype.DICHOTOMOUS ? (
                        <>
                            <tr>
                                {/* TODO - pull from data */}
                                <td>Dependent Variable</td>
                                <td>Dose</td>
                            </tr>
                            <tr>
                                {/* TODO - pull from data */}
                                <td>Independent Variable</td>
                                <td>Fraction affected</td>
                            </tr>
                            <tr>
                                <td>Number of Observations</td>
                                <td>{dataset.doses.length}</td>
                            </tr>
                            <tr>
                                <td>Adverse Direction</td>
                                <td>Up</td>
                            </tr>
                        </>
                    ) : null}
                    {dtype == Dtype.CONTINUOUS || dtype == Dtype.CONTINUOUS_INDIVIDUAL ? (
                        <>
                            <tr>
                                {/* TODO - pull from data */}
                                <td>Dependent Variable</td>
                                <td>Dose</td>
                            </tr>
                            <tr>
                                {/* TODO - pull from data */}
                                <td>Independent Variable</td>
                                <td>Mean</td>
                            </tr>
                            <tr>
                                <td>Number of Observations</td>
                                <td>{dataset.doses.length}</td>
                            </tr>
                            <tr>
                                {/* TODO - pull from data */}
                                <td>Adverse Direction</td>
                                <td>Up</td>
                            </tr>
                        </>
                    ) : null}
                </tbody>
            </table>
        );
    }
}

ModelData.propTypes = {
    dtype: PropTypes.string.isRequired,
    dataset: PropTypes.object.isRequired,
};
export default ModelData;
