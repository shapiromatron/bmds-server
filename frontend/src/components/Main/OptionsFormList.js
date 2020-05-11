import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import OptionsForm from "./OptionsForm";

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
        let model_type = this.props.DataStore.modelType;
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
                                            {model_type === "C" ? <th>BMR Type</th> : null}
                                            {model_type === "D" ? <th>Risk Type</th> : null}
                                            <th>BMRF</th>
                                            {model_type === "C" ? <th>Tail Probability</th> : null}
                                            <th>Confidence Level</th>
                                            {model_type === "C" ? <th>Distribution</th> : null}
                                            {model_type === "C" ? <th>Variance</th> : null}
                                            {model_type === "C" ? (
                                                <th>Polynomial Restriction</th>
                                            ) : null}
                                            <th>Background</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.DataStore.options.map((item, id) => (
                                            <OptionsForm
                                                key={id}
                                                item={item}
                                                model_type={model_type}
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
