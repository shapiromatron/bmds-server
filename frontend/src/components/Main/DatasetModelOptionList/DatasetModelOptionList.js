import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import DatasetModelOption from "./DatasetModelOption";
import DatasetModelOptionReadOnly from "./DatasetModelOptionReadOnly";
import PropTypes from "prop-types";

import {datasetOptionColumnNames} from "../../../constants/dataConstants";

@inject("dataOptionStore")
@observer
class DatasetList extends Component {
    render() {
        const {dataOptionStore} = this.props,
            {canEdit, getDataset, options, updateOption} = dataOptionStore;

        if (options.length < 1) {
            return null;
        }

        const headers = datasetOptionColumnNames[options[0].dtype];

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
                                    key={option.datasetId}
                                    dataset={getDataset(option)}
                                    option={option}
                                    handleChange={updateOption}
                                />
                            );
                        } else {
                            return (
                                <DatasetModelOptionReadOnly
                                    key={option.datasetId}
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
DatasetList.propTypes = {
    dataOptionStore: PropTypes.object,
};
export default DatasetList;
