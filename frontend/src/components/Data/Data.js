import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import InputFormList from "./InputFormList";
import DatasetNames from "./DatasetNames";
import SelecModelType from "./SelectModelType";
import ScatterPlot from "./ScatterPlot";
import "./Data.css";

@inject("dataStore")
@observer
class Data extends Component {
    render() {
        const {dataStore} = this.props;
        return (
            <div className="container-fluid">
                <div className="row justify-content-sm-around">
                    <div className="col-xs-12 col-sm-12 col-md-2">
                        <SelecModelType />
                        {dataStore.getDataLength ? <DatasetNames /> : null}
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4">
                        {dataStore.getDataLength ? <InputFormList /> : null}
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4">
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
