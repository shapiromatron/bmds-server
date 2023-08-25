import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

import {Dtype} from "@/constants/dataConstants";

import HelpTextPopover from "../../common/HelpTextPopover";
import DatasetModelOption from "./DatasetModelOption";

const maxDegreeText = `Studies have indicated that higher degree polynomial models are not
    warranted in that they generally do not sufficiently improve fit over simpler models
    (Nitcheva et al., 2007; PMC2040324).  Complex models also increase computer processing time
    and the chance of model failure.`,
    maxDegreeOnlyText = `When checked, the multistage model is run in the form  y = β₀ + β₁X + β<sub>n</sub>X<sup>n</sup>, where <i>n</i> is the maximum degree. When unchecked, the the includes intermediate powers, is run in the form y = β₀ + β₁X + β₂X² + ... + β<sub>n</sub>X<sup>n</sup>`,
    maxPolyDegreeOnlyText = `When checked, the polynomial model is run in the form  y = β₀ + β₁X + β<sub>n</sub>X<sup>n</sup>, where <i>n</i> is the maximum degree. When unchecked, the the includes intermediate powers, is run in the form y = β₀ + β₁X + β₂X² + ... + β<sub>n</sub>X<sup>n</sup>`;

@inject("dataOptionStore")
@observer
class DatasetModelOptionList extends Component {
    render() {
        const {dataOptionStore} = this.props,
            {options} = dataOptionStore,
            dtype = dataOptionStore.getModelType;

        if (options.length == 0) {
            return null;
        }

        return (
            <table className="table table-sm table-bordered">
                <thead>
                    {dtype == Dtype.CONTINUOUS || dtype == Dtype.CONTINUOUS_INDIVIDUAL ? (
                        <tr className="bg-custom">
                            <th>Enabled</th>
                            <th>Dataset</th>
                            <th className="preview">
                                Maximum polynomial degree only
                                <HelpTextPopover content={maxPolyDegreeOnlyText} />
                            </th>
                            <th>
                                Maximum polynomial degree&nbsp;
                                <HelpTextPopover content={maxDegreeText} />
                            </th>
                            <th>Adverse Direction</th>
                        </tr>
                    ) : null}
                    {dtype == Dtype.MULTI_TUMOR ? (
                        <tr className="bg-custom">
                            <th>Enabled</th>
                            <th>Dataset</th>
                        </tr>
                    ) : null}
                    {dtype == Dtype.DICHOTOMOUS ? (
                        <tr className="bg-custom">
                            <th>Enabled</th>
                            <th>Dataset</th>
                            <th className="preview">
                                Maximum degree only
                                <HelpTextPopover content={maxDegreeOnlyText} />
                            </th>
                            <th>
                                Maximum multistage degree
                                <HelpTextPopover content={maxDegreeText} />
                            </th>
                        </tr>
                    ) : null}
                    {dtype == Dtype.NESTED_DICHOTOMOUS ? (
                        <tr className="bg-custom">
                            <th>Enabled</th>
                            <th>Dataset</th>
                        </tr>
                    ) : null}
                </thead>
                <tbody>
                    {options.map(option => {
                        return (
                            <DatasetModelOption
                                key={option.dataset_id}
                                datasetId={option.dataset_id}
                                store={dataOptionStore}
                            />
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
DatasetModelOptionList.propTypes = {
    dataOptionStore: PropTypes.object,
};
export default DatasetModelOptionList;
