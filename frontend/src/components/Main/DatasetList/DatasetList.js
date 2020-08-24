import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import Datasets from "./Datasets";
import DatasetsReadOnly from "./DatasetsReadOnly";
import PropTypes from "prop-types";

@inject("dataStore")
@observer
class DatasetList extends Component {
    render() {
        const {dataStore} = this.props;
        return (
            <div>
                {dataStore.getDataLength ? (
                    <table className="table table-bordered table-sm  datasetlist-table">
                        <thead>
                            <tr className="table-primary">
                                {dataStore.getDatasetNamesHeader.map((item, i) => {
                                    return [<th key={i}>{item}</th>];
                                })}
                            </tr>
                        </thead>
                        {dataStore.getEditSettings ? (
                            <Datasets />
                        ) : (
                            <DatasetsReadOnly datasets={dataStore.getDatasets} />
                        )}
                    </table>
                ) : null}
            </div>
        );
    }
}
DatasetList.propTypes = {
    dataStore: PropTypes.object,
    getDataLength: PropTypes.func,
    getDatasetNamesHeader: PropTypes.string,
    getEditSettings: PropTypes.func,
    getDatasets: PropTypes.string,
};
export default DatasetList;
