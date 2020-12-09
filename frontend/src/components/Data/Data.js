import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import DatasetForm from "./DatasetForm";
import DatasetSelector from "./DatasetSelector";
import SelecModelType from "./SelectModelType";
import ScatterPlot from "./ScatterPlot";
import "./Data.css";
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
                        {dataStore.getEditSettings ? <SelecModelType /> : null}
                        {dataStore.getDataLength ? <DatasetSelector /> : null}
                    </div>
                    <div className="col-md-5">
                        {dataStore.getDataLength ? (
                            <div>
                                {dataStore.getEditSettings ? <DatasetForm /> : <DatasetTable />}
                            </div>
                        ) : null}
                    </div>
                    <div className="col-md-5">
                        {dataStore.getDataLength ? <ScatterPlot /> : null}
                    </div>
                </div>
            </div>
        );
    }
}
Data.propTypes = {
    dataStore: PropTypes.object,
    getDataLength: PropTypes.func,
};
export default Data;
