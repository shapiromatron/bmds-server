import React, {Component} from "react";
import {inject, observer} from "mobx-react";

@inject("store")
@observer
class DataTable extends Component {
    render() {
        const {store} = this.props;
        return (
            <div>
                <div>
                    {store.getDataLength > 0 ? (
                        <div className="row" style={{marginTop: 20}}>
                            <div className="col-md-6 column">
                                {store.savedDataset.map((item, index) => (
                                    <div key={index}>
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        {item.dataset_name}
                                                        <button
                                                            className="btn btn-danger close"
                                                            aria-label="Close"
                                                            onClick={() =>
                                                                store.deleteDataset(item.id)
                                                            }>
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.keys(item).map((dev, i) => {
                                                    return [
                                                        <tr key={i}>
                                                            {Array.isArray(item[dev]) ? (
                                                                <th>{dev}</th>
                                                            ) : null}
                                                            {Array.isArray(item[dev])
                                                                ? item[dev].map((val, index) => {
                                                                      return [
                                                                          <td key={index}>
                                                                              {val}
                                                                          </td>,
                                                                      ];
                                                                  })
                                                                : null}
                                                        </tr>,
                                                    ];
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
}

export default DataTable;
