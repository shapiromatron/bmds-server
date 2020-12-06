import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import DatasetForm from "./DatasetForm";
import DatasetSelector from "./DatasetSelector";
import SelecModelType from "./SelectModelType";
import DoseResponsePlot from "./DoseResponsePlot";
import DatasetTable from "./DatasetTable";
import "./DataTab.css";

@inject("dataStore")
@observer
class Data extends Component {
    render() {
        const {dataStore} = this.props;
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2">
                        {dataStore.getEditSettings ? <SelecModelType /> : null}
                        {dataStore.getDataLength ? <DatasetSelector /> : null}
                    </div>
                    <div className="col-md-6">
                        {dataStore.hasSelectedDataset ? (
                            <div>
                                {dataStore.getEditSettings ? <DatasetForm /> : <DatasetTable />}
                            </div>
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
