import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import OptionsForm from "./OptionsForm";
import {toJS} from "mobx";

@inject("store")
@observer
class OptionsFormList extends Component {
    onChange = e => {
        e.preventDefault();
        const {name, value, id} = e.target;
        let parsedValue = "";
        if (name == "bmr_value" || name == "tail_probability" || name == "confidence_level") {
            parsedValue = parseFloat(value);
        } else {
            parsedValue = value;
        }
        this.props.store.saveOptions(name, parsedValue, id);
    };
    deleteOption = (e, val) => {
        e.preventDefault();
        this.props.store.deleteOptions(val);
    };
    render() {
        const {store} = this.props;
        let dataset_type = store.analysisForm.dataset_type;
        let options = toJS(store.options);
        return (
            <form>
                <div className="row" style={{marginTop: 20}}>
                    <div className="col">
                        <div>
                            <form>
                                <table className="table table-bordered">
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
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {options.map((item, id) => (
                                            <OptionsForm
                                                className="form-control"
                                                key={id}
                                                item={item}
                                                dataset_type={dataset_type}
                                                idx={id}
                                                onchange={this.onChange}
                                                delete={this.deleteOption.bind(this)}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                                <button
                                    type="button"
                                    className="btn btn-primary "
                                    onClick={()=>store.createOptions()}>
                                    add option set
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

export default OptionsFormList;
