import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

import DoseResponsePlot from "../common/DoseResponsePlot";
import DatasetForm from "./DatasetForm";
import DatasetSelector from "./DatasetSelector";
import DatasetTable from "./DatasetTable";
import SelectModelType from "./SelectModelType";

class Data extends Component {
    render() {
        const {dataStore} = this.props;
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2">
                        {dataStore.canEdit ? <SelectModelType /> : null}
                        {dataStore.getDataLength ? <DatasetSelector store={dataStore} /> : null}
                    </div>
                    <div className="col-md-6">
                        {dataStore.hasSelectedDataset ? (
                            dataStore.canEdit ? (
                                <DatasetForm />
                            ) : (
                                <DatasetTable dataset={dataStore.selectedDataset} />
                            )
                        ) : null}
                    </div>
                    <div className="col-md-4">
                        {dataStore.hasSelectedDataset ? (
                            <DoseResponsePlot
                                layout={dataStore.drPlotLayout}
                                data={dataStore.drPlotData}
                            />
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }
}
Data.propTypes = {
    dataStore: PropTypes.object,
};
export default inject("dataStore")(observer(Data));
