import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import DatasetModelOption from "./DatasetModelOption";
import PropTypes from "prop-types";

import {Dtype} from "../../../constants/dataConstants";
import HelpTextPopover from "../../common/HelpTextPopover";

const maxDegreeText = `Studies have indicated that higher degree polynomial models are not
    warranted in that they generally do not sufficiently improve fit over simpler models
    (Nitcheva et al., 2007; PMC2040324).  Complex models also increase computer processing time
    and the chance of model failure.`;

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
            <table className="table table-bordered table-sm">
                <thead>
                    {dtype == Dtype.CONTINUOUS || dtype == Dtype.CONTINUOUS_INDIVIDUAL ? (
                        <tr className="bg-custom">
                            <th>Enabled</th>
                            <th>Dataset</th>
                            <th>
                                Maximum polynomial degree&nbsp;
                                <HelpTextPopover content={maxDegreeText} />
                            </th>
                            <th>Adverse Direction</th>
                        </tr>
                    ) : null}
                    {dtype == Dtype.DICHOTOMOUS ? (
                        <tr className="bg-custom">
                            <th>Enabled</th>
                            <th>Dataset</th>
                            <th>
                                Maximum multistage degree&nbsp;
                                <HelpTextPopover content={maxDegreeText} />
                            </th>
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
