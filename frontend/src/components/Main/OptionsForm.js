import React, {Component} from "react";
import OptionsList from "./OptionsList";

import {inject, observer} from "mobx-react";

@inject("DataStore")
@observer
class OptionsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            optionsList: [
                {
                    index: Math.floor(Math.random() * 100),
                    bmr_type: "",
                    bmr_value: "",
                    tail_probability: "",
                    confidence_level: "",
                    distribution: "",
                    variance: "",
                    polynomial_restriction: "",
                    background: "",
                },
            ],
        };
    }

    onChange = e => {
        const {name, value, id} = e.target;
        this.props.DataStore.saveOptions(name, value, id);
    };

    addNewRow = e => {
        this.setState(prevState => ({
            optionsList: [
                ...prevState.optionsList,
                {
                    index: Math.floor(Math.random() * 100),
                    bmr_type: "",
                    bmr_value: "",
                    tail_probability: "",
                    confidence_level: "",
                    distribution: "",
                    variance: "",
                    polynomial_restriction: "",
                    background: "",
                },
            ],
        }));
    };

    clickOnDelete(record) {
        this.props.DataStore.deleteOptions(record.index);
        this.setState({
            optionsList: this.state.optionsList.filter(r => r !== record),
        });
    }

    render() {
        let {optionsList} = this.state;

        return (
            <div className="content">
                {this.props.DataStore.modelType.length > 0 ? (
                    <form>
                        <div className="row" style={{marginTop: 20}}>
                            <div className="col">
                                <div className="card">
                                    <div className="card-body">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Option Set #</th>
                                                    <th>BMR Type</th>
                                                    <th>BMRF</th>
                                                    <th>Tail Probability</th>
                                                    <th>Confidence Level</th>
                                                    <th>Distribution</th>
                                                    <th>Variance</th>
                                                    <th>Polynomial Restriction</th>
                                                    <th>Background</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <OptionsList
                                                    add={this.addNewRow}
                                                    delete={this.clickOnDelete.bind(this)}
                                                    optionsList={optionsList}
                                                    onchange={this.onChange.bind(this)}
                                                />
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colSpan="2" className="align-left">
                                                        <button
                                                            onClick={this.addNewRow}
                                                            type="button"
                                                            className="btn btn-primary ">
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
                ) : null}
            </div>
        );
    }
}

export default OptionsForm;
