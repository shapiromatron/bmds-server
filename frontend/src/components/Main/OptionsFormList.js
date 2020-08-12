import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import OptionsForm from "./OptionsForm";
import OptionsReadOnly from "./OptionsReadOnly";

@inject("optionsStore")
@observer
class OptionsFormList extends Component {
    render() {
        const {optionsStore} = this.props,
            onChange = e => {
                e.preventDefault();
                const {name, value, id} = e.target;
                let parsedValue = "";
                if (
                    name == "bmr_value" ||
                    name == "tail_probability" ||
                    name == "confidence_level"
                ) {
                    parsedValue = parseFloat(value);
                } else {
                    parsedValue = value;
                }
                optionsStore.saveOptions(name, parsedValue, id);
            },
            deleteOption = (e, val) => {
                e.preventDefault();
                optionsStore.deleteOptions(val);
            },
            dataset_type = optionsStore.rootStore.mainStore.dataset_type;
        let headers = optionsStore.headers;
        let options = optionsStore.optionsList;
        let isEditSettings = optionsStore.getEditSettings();

        return (
            <div className="options-div">
                <div className="panel panel-default">
                    <form className="form-horizontal">
                        <table className="options-table table table-bordered table-sm">
                            <thead className="table-primary">
                                <tr>
                                    {headers.map((item, index) => {
                                        return [<th key={index}>{item}</th>];
                                    })}
                                    {isEditSettings ? (
                                        <th>
                                            <button
                                                type="button"
                                                data-toggle="tooltip"
                                                data-placement="right"
                                                title="Add New Option Set"
                                                className="btn btn-primary "
                                                onClick={() => optionsStore.addOptions()}>
                                                <i className="fa fa-plus"></i>{" "}
                                            </button>
                                        </th>
                                    ) : null}
                                </tr>
                            </thead>
                            {isEditSettings ? (
                                <tbody>
                                    {options.map((options, id) => (
                                        <OptionsForm
                                            key={id}
                                            options={options}
                                            dataset_type={dataset_type}
                                            idx={id}
                                            onchange={onChange}
                                            delete={deleteOption.bind(this)}
                                        />
                                    ))}
                                </tbody>
                            ) : (
                                <tbody>
                                    {options.map((option, id) => (
                                        <OptionsReadOnly
                                            className="form-control"
                                            key={id}
                                            idx={id}
                                            item={option}
                                        />
                                    ))}
                                </tbody>
                            )}
                        </table>
                    </form>
                </div>
            </div>
        );
    }
}

export default OptionsFormList;
