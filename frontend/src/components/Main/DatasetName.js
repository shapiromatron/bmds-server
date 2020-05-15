import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {Form} from "react-bootstrap";

@inject("DataStore")
@observer
class DatasetName extends Component {
    constructor(props) {
        super(props);
    }

    handleCheckbox(e, item) {
        this.props.DataStore.toggleDataset(item.id);
    }
    onChange(e, item) {
        this.props.DataStore.saveAdverseDirection(e.target.name, e.target.value, item.id);
    }
    render() {
        let obj = this.props.DataStore.savedDataset.filter(data => data.enabled == true);
        return (
            <div>
                {this.props.DataStore.getDataLength > 0 ? (
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                {this.props.DataStore.DatasetNamesHeader.map((item, i) => {
                                    return [<th key={i}>{item}</th>];
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.DataStore.savedDataset.map((item, index) => {
                                return [
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name="isIncluded"
                                                checked={obj.includes(item)}
                                                onChange={e => this.handleCheckbox(e, item)}
                                            />
                                        </td>
                                        <td>{item.dataset_name}</td>
                                        <td>
                                            {" "}
                                            <Form.Control
                                                as="select"
                                                name="adverse_direction"
                                                onChange={e => this.onChange(e, item)}>
                                                {this.props.DataStore.AdverseDirectionList.map(
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
