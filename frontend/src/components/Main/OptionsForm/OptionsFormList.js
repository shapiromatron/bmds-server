import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import OptionsForm from "./OptionsForm";
import OptionsReadOnly from "./OptionsReadOnly";
import PropTypes from "prop-types";

@inject("optionsStore")
@observer
class OptionsFormList extends Component {
    render() {
        const {optionsStore} = this.props;
        return (
            <div className="options-div">
                <div className="panel panel-default">
                    <form className="form-horizontal">
                        <table className="options-table table table-bordered table-sm">
                            <thead className="table-primary">
                                <tr>
                                    {optionsStore.headers.map((item, index) => {
                                        return [<th key={index}>{item}</th>];
                                    })}
                                    {optionsStore.getEditSettings ? (
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
                            {optionsStore.getEditSettings ? (
                                <tbody>
                                    {optionsStore.optionsList.map((options, id) => (
                                        <OptionsForm
                                            key={id}
                                            options={options}
                                            dataset_type={optionsStore.getDatasetType}
                                            idx={id}
                                        />
                                    ))}
                                </tbody>
                            ) : (
                                <tbody>
                                    {optionsStore.optionsList.map((options, id) => (
                                        <OptionsReadOnly
                                            className="form-control"
                                            key={id}
                                            idx={id}
                                            options={options}
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

OptionsFormList.propTypes = {
    optionsStore: PropTypes.object,
    saveOptions: PropTypes.func,
    deleteOptions: PropTypes.func,
    headers: PropTypes.array,
    getEditSettings: PropTypes.func,
    addOptions: PropTypes.func,
    optionsList: PropTypes.array,
};
export default OptionsFormList;
