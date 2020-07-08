import React from "react";
const DatasetList = props => {
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
                        {props.datasets.map((item, index) => {
                            return [
                                <tr key={index} className="currentdataset">
                                    <td>
                                        <a onClick={e => props.onClick(e, item.dataset_id)}>
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
};

export default DatasetList;
