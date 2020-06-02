import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {Form} from "react-bootstrap";

@inject("store")
@observer
class DatasetName extends Component {
    handleCheckbox(e, dataset_id) {
        this.props.store.toggleDataset(dataset_id);
    }
    onChange(e, item) {
        this.props.store.saveAdverseDirection(e.target.name, e.target.value, item.id);
    }
    render() {
        let obj = this.props.store.datasets.filter(data => data.enabled == true);
        return (
            <div>
                {this.props.store.getDataLength > 0 ? (
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                {this.props.store.DatasetNamesHeader.map((item, i) => {
                                    return [<th key={i}>{item}</th>];
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.store.datasets.map((item, index) => {
                                return [
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name="isIncluded"
                                                checked={obj.includes(item)}
                                                onChange={e =>
                                                    this.handleCheckbox(e, item.dataset_id)
                                                }
                                            />
                                        </td>
                                        <td>{item.dataset_name}</td>
                                        <td>
                                            {" "}
                                            <Form.Control
                                                as="select"
                                                name="adverse_direction"
                                                onChange={e => this.onChange(e, item)}>
                                                {this.props.store.AdverseDirectionList.map(
                                                    (item, i) => {
                                                        return [
                                                            <option key={i} value={item.value}>
                                                                {item.name}
                                                            </option>,
                                                        ];
                                                    }
                                                )}
                                            </Form.Control>
                                        </td>
                                    </tr>,
                                ];
                            })}
                        </tbody>
                    </table>
                ) : null}
            </div>
        );
    }
}

export default DatasetName;
