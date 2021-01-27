import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import DatasetModelOption from "./DatasetModelOption";
import DatasetModelOptionReadOnly from "./DatasetModelOptionReadOnly";
import PropTypes from "prop-types";

import {datasetOptionColumnNames} from "../../../constants/dataConstants";

@inject("dataOptionStore")
@observer
class DatasetModelOptionList extends Component {
    render() {
        const {dataOptionStore} = this.props,
            {canEdit, getDataset, options, updateOption} = dataOptionStore;

        if (options.length == 0) {
            return null;
        }
        const headers = datasetOptionColumnNames[getDataset(options[0]).dtype];

        return (
            <table className="table table-bordered table-sm">
                <thead>
                    <tr className="table-primary">
                        {headers.map(text => (
                            <th key={text}>{text}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {options.map(option => {
                        if (canEdit) {
                            return (
                                <DatasetModelOption
                                    key={option.dataset_id}
                                    dataset={getDataset(option)}
                                    option={option}
                                    handleChange={updateOption}
                                />
                            );
                        } else {
                            return (
                                <DatasetModelOptionReadOnly
                                    key={option.dataset_id}
                                    dataset={getDataset(option)}
                                    option={option}
                                />
                            );
                        }
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
