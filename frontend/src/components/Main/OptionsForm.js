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
        let optionsList = [...this.state.optionsList];
        if (
            [
                "bmr_type",
                "bmr_value",
                "tail_probability",
                "confidence_level",
                "distribution",
                "variance",
                "polynomial_restriction",
                "background",
            ].includes(e.target.name)
        ) {
            optionsList[e.target.dataset.id][e.target.name] = e.target.value;
        } else {
            this.setState({[e.target.name]: e.target.value});
        }
        this.props.DataStore.addOptions(optionsList);
    };

    addNewRow = e => {
        this.setState(prevState => ({
            optionsList: [
                ...prevState.optionsList,
                {
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

    deteteRow = index => {
        this.setState({
            optionsList: this.state.optionsList.filter((s, sindex) => index !== sindex),
        });
    };

    clickOnDelete(record) {
        this.setState({
            optionsList: this.state.optionsList.filter(r => r !== record),
        });
    }

    render() {
        let {optionsList} = this.state;

        return (
            <div className="content">
                <form onChange={this.onChange}>
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
                                            />
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan="4" className="align-left">
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
            </div>
        );
    }
}

export default OptionsForm;
