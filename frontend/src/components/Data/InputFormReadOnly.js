import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("dataStore")
@observer
class InputFormReadOnly extends Component {
    render() {
        const {dataStore} = this.props;
        return (
            <>
                <div className="label">
                    <label style={{marginRight: "20px"}}>Dataset Name:</label>
                    {dataStore.getCurrentDatasets.dataset_name}
                </div>
                <div className="table-responsive-sm">
                    <table className="table table-bordered table-stripped table-hover table-sm text-center">
                        <thead className="table-primary">
                            <tr>
                                {dataStore.getLabels.map((item, index) => {
                                    return <th key={index}>{item}</th>;
                                })}
                            </tr>
                            <tr>
                                {Object.keys(dataStore.getCurrentDatasets.column_names).map(
                                    (item, i) => {
                                        return (
                                            <td key={i}>
                                                {dataStore.getCurrentDatasets.column_names[item]}
                                            </td>
                                        );
                                    }
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {dataStore.getMappedArray.map((row, i) => {
                                return (
                                    <tr key={i}>
                                        {Object.keys(row).map((key, index) => {
                                            return <td key={index}>{row[key]}</td>;
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}
InputFormReadOnly.propTypes = {
    dataStore: PropTypes.object,
    currentDataset: PropTypes.object,
    dataset_name: PropTypes.string,
    column_names: PropTypes.array,
    mappedDatasets: PropTypes.array,
    labels: PropTypes.array,
    getCurrentDatasets: PropTypes.func,
    getLabels: PropTypes.func,
};
export default InputFormReadOnly;
