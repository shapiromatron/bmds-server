import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import OptionsForm from "./OptionsForm";
import OptionsReadOnly from "./OptionsReadOnly";
@inject("mainStore")
@observer
class OptionsFormList extends Component {
    render() {
        const {mainStore} = this.props,
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
                mainStore.saveOptions(name, parsedValue, id);
            },
            deleteOption = (e, val) => {
                e.preventDefault();
                mainStore.deleteOptions(val);
            },
            createOptions = () => {
                mainStore.createOptions();
            },
            dataset_type = mainStore.analysisForm.dataset_type,
            labels = mainStore.getOptionsLabels(dataset_type),
            options = mainStore.options,
            isEditSettings = mainStore.getEditSettings();

        return (
            <div className="options-div">
                {labels.length ? (
                    <div className="panel panel-default">
                        <form className="form-horizontal">
                            <table className="options-table table table-bordered table-sm">
                                <thead className="table-primary">
                                    <tr>
                                        {labels.map((item, index) => {
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
                                                    onClick={createOptions}>
                                                    <i className="fa fa-plus"></i>{" "}
                                                </button>
                                            </th>
                                        ) : null}
                                    </tr>
                                </thead>
                                {isEditSettings ? (
                                    <tbody>
                                        {options.map((item, id) => (
                                            <OptionsForm
                                                key={id}
                                                item={item}
                                                dataset_type={dataset_type}
                                                idx={id}
                                                onchange={onChange}
                                                delete={deleteOption.bind(this)}
                                            />
                                        ))}
                                    </tbody>
                                ) : (
                                    <tbody>
                                        {options.map((item, id) => (
                                            <OptionsReadOnly
                                                className="form-control"
                                                key={id}
                                                idx={id}
                                                item={item}
                                            />
                                        ))}
                                    </tbody>
                                )}
                            </table>
                        </form>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default OptionsFormList;
