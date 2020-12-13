import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import DatasetForm from "./DatasetForm";
import DatasetSelector from "./DatasetSelector";
import SelectModelType from "./SelectModelType";
import DoseResponsePlot from "./DoseResponsePlot";
import DatasetTable from "./DatasetTable";
@inject("dataStore")
@observer
class Data extends Component {
    render() {
        const {dataStore} = this.props;
        return (
            <div className="container-fluid">
                <div className="row mt-2">
                    <div className="col-md-2">
                        {dataStore.getEditSettings ? <SelectModelType /> : null}
                        {dataStore.getDataLength ? <DatasetSelector /> : null}
                    </div>
                    <div className="col-md-6">
                        {dataStore.hasSelectedDataset ? (
                            dataStore.getEditSettings ? (
                                <DatasetForm />
                            ) : (
                                <DatasetTable />
                            )
                        ) : null}
                    </div>
                    <div className="col-md-4">
                        {dataStore.hasSelectedDataset ? <DoseResponsePlot /> : null}
                    </div>
                </div>
            </div>
        );
    }
}
Data.propTypes = {
    dataStore: PropTypes.object,
};
export default Data;
