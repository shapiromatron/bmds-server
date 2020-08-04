import React, {Component} from "react";
import {inject, observer} from "mobx-react";

@inject("dataStore")
@observer
class DatasetNames extends Component {
    render() {
        const {dataStore} = this.props;
        return (
            <div>
                <div className="editdataset">
                    <table className="table table-bordered table-hover table-sm">
                        <thead>
                            <tr className="table-primary">
                                <th>Datasets</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataStore.datasets.map((item, index) => {
                                return [
                                    <tr key={index} className="currentdataset">
                                        <td>
                                            <a
                                                onClick={() =>
                                                    dataStore.setCurrentDatasetIndex(
                                                        item.dataset_id
                                                    )
                                                }>
                                                {item.dataset_name}
                                            </a>
                                        </td>
                                    </tr>,
                                ];
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default DatasetNames;
