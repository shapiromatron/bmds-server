import {observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

import {getLabel} from "@/common";
import {Dtype} from "@/constants/dataConstants";
import {hasDegrees} from "@/constants/modelConstants";
import {
    continuousBmrOptions,
    dichotomousBmrOptions,
    distTypeOptions,
} from "@/constants/optionsConstants";
import {priorClassLabels} from "@/constants/outputConstants";
import {ff} from "@/utils/formatters";

const restrictionMapping = {
    0: ["Model Restriction", "Unrestricted"],
    1: ["Model Restriction", "Restricted"],
    2: ["Model Approach", "Bayesian"],
};

@observer
class ModelOptions extends Component {
    render() {
        const {model} = this.props;
        let data = [];

        data = [
            ["BMR Type", "BMR Tpype"],
            ["BMR", "BMR"],
            ["Confidence Level", "confidence level"],
            ["Degree", "degree"],
        ];

        return (
            <table className="table table-sm table-bordered col-r-2">
                <thead>
                    <tr className="bg-custom">
                        <th colSpan="2">Model Options</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((d, i) => {
                        if (!d) {
                            return null;
                        }
                        return (
                            <tr key={i}>
                                <td>{d[0]}</td>
                                <td>{d[1]}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
ModelOptions.propTypes = {
    model: PropTypes.object.isRequired,
};
export default ModelOptions;
