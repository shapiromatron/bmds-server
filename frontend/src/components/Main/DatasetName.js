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
        if (e.target.checked) {
            this.props.DataStore.addActiveDataset(item);
        } else {
            this.props.DataStore.deleteActiveDataset(item.id);
        }
    }
    render() {
        return (
            <div>
                {this.props.DataStore.getDataLength > 0 ? (
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Enable</th>
                                <th>DataSets</th>
                                <th>Adverse Direction</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.DataStore.datasets.map((item, index) => {
                                return [
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name="isIncluded"
                                                onChange={e => this.handleCheckbox(e, item)}
                                            />
                                        </td>
                                        <td>{item.dataset_name}</td>
                                        <td>
                                            {" "}
                                            <Form.Control as="select" name="adverseDirection">
                                                <option value="automatic">autmatic</option>
                                                <option value="up">up</option>
                                                <option value="down">down</option>
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
