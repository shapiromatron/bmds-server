import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import InputFormList from "./InputFormList";
import DatasetNames from "./DatasetNames";
import SelecModelType from "./SelectModelType";
import ScatterPlot from "./ScatterPlot";
import DeleteButton from "./DeleteButton";
import "./Data.css";
import InputFormReadOnly from "./InputFormReadOnly";

@inject("dataStore")
@observer
class Data extends Component {
    render() {
        const {dataStore} = this.props;
        return (
            <div className="container-fluid">
                <div className="row justify-content-sm-around">
                    <div className="col-xs-12 col-sm-12 col-md-2">
                        {dataStore.getEditSettings ? <SelecModelType /> : null}
                        {dataStore.getDataLength ? (
                            <div>
                                <DatasetNames />
                                {dataStore.getEditSettings ? <DeleteButton /> : null}
                            </div>
                        ) : null}
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4">
                        {dataStore.getDataLength ? (
                            <div>
                                {dataStore.getEditSettings ? (
                                    <InputFormList />
                                ) : (
                                    <InputFormReadOnly />
                                )}
                            </div>
                        ) : null}
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
