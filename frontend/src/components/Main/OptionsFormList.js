import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import OptionsForm from "./OptionsForm";
import {toJS} from "mobx";
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
            dataset_type = mainStore.analysisForm.dataset_type,
            labels = mainStore.getOptionsLabels(dataset_type),
            options = toJS(mainStore.options),
            isEditSettings = mainStore.getEditSettings();
        return (
            <form>
                <div className="row" style={{marginTop: 20}}>
                    <div className="col">
                        <div>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        {labels.map((item, index) => {
                                            return [<th key={index}>{item.label}</th>];
                                        })}
                                    </tr>
                                </thead>
                                {isEditSettings ? (
                                    <tbody>
                                        {options.map((item, id) => (
                                            <OptionsForm
                                                className="form-control"
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
                            {isEditSettings ? (
                                <button
                                    type="button"
                                    className="btn btn-primary "
                                    onClick={() => mainStore.createOptions()}>
                                    Add option set
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

export default OptionsFormList;
