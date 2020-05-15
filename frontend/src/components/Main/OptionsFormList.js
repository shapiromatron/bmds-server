import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import OptionsForm from "./OptionsForm";
import {toJS} from "mobx";

@inject("DataStore")
@observer
class OptionsFormList extends Component {
    constructor(props) {
        super(props);
    }

    onChange = e => {
        const {name, value, id} = e.target;
        let parsedValue = "";
        if (name == "bmr_value" || name == "tail_probability" || name == "confidence_level") {
            parsedValue = parseFloat(value);
        } else {
            parsedValue = value;
        }
        this.props.DataStore.saveOptions(name, parsedValue, id);
    };

    createOptionSet = e => {
        this.props.DataStore.createOptions();
    };

    deleteOption = (e, val) => {
        e.preventDefault();
        this.props.DataStore.deleteOptions(val);
    };

    render() {
        let dataset_type = this.props.DataStore.usersInput.dataset_type;
        let options = toJS(this.props.DataStore.usersInput.options);
        return (
            <form>
                <div className="row" style={{marginTop: 20}}>
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Option Set #</th>
                                            {dataset_type === "C" ? <th>BMR Type</th> : null}
                                            {dataset_type === "D" ? <th>Risk Type</th> : null}
                                            <th>BMRF</th>
                                            {dataset_type === "C" ? (
                                                <th>Tail Probability</th>
                                            ) : null}
                                            <th>Confidence Level</th>
                                            {dataset_type === "C" ? <th>Distribution</th> : null}
                                            {dataset_type === "C" ? <th>Variance</th> : null}
                                            {dataset_type === "C" ? (
                                                <th>Polynomial Restriction</th>
                                            ) : null}
                                            <th>Background</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {options.map((item, id) => (
                                            <OptionsForm
                                                key={id}
                                                item={item}
                                                dataset_type={dataset_type}
                                                idx={id}
                                                onchange={this.onChange}
                                                delete={this.deleteOption.bind(this)}
                                            />
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="2" className="align-left">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary "
                                                    onClick={this.createOptionSet}>
                                                    add option set
                                                </button>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

export default OptionsFormList;
