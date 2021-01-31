import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import {toJS} from "mobx";

import OptionsForm from "./OptionsForm";
import OptionsReadOnly from "./OptionsReadOnly";
import {MODEL_CONTINUOUS, MODEL_DICHOTOMOUS} from "../../../constants/mainConstants";

@inject("optionsStore")
@observer
class OptionsFormList extends Component {
    render() {
        const {optionsStore} = this.props,
            modelType = optionsStore.getModelType,
            optionsList = toJS(optionsStore.optionsList);
        return (
            <div>
                <div className="panel panel-default">
                    <form className="form-horizontal">
                        <table className="options-table table table-bordered table-sm text-center">
                            <thead className="table-primary">
                                <tr>
                                    {modelType === MODEL_CONTINUOUS ? (
                                        <>
                                            <td>BMR Type</td>
                                            <td>BMRF</td>
                                            <td>Tail Probability</td>
                                            <td>Confidence Level</td>
                                            <td>Distribution + Variance</td>
                                        </>
                                    ) : null}
                                    {modelType === MODEL_DICHOTOMOUS ? (
                                        <>
                                            <td>Risk Type</td>
                                            <td>BMR</td>
                                            <td>Confidence Level</td>
                                        </>
                                    ) : null}
                                    {optionsStore.canEdit ? (
                                        <th>
                                            <button
                                                type="button"
                                                data-toggle="tooltip"
                                                data-placement="right"
                                                title="Add New Option Set"
                                                className="btn btn-primary "
                                                disabled={!optionsStore.canAddNewOption}
                                                onClick={() => optionsStore.addOptions()}>
                                                <i className="fa fa-plus"></i>{" "}
                                            </button>
                                        </th>
                                    ) : null}
                                </tr>
                            </thead>
                            {optionsStore.canEdit ? (
                                <tbody>
                                    {optionsList.map((options, id) => (
                                        <OptionsForm
                                            key={id}
                                            idx={id}
                                            options={options}
                                            modelType={modelType}
                                            deleteOptions={optionsStore.deleteOptions}
                                            saveOptions={optionsStore.saveOptions}
                                        />
                                    ))}
                                </tbody>
                            ) : (
                                <tbody>
                                    {optionsList.map((options, id) => (
                                        <OptionsReadOnly
                                            key={id}
                                            idx={id}
                                            options={options}
                                            modelType={modelType}
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
};

export default OptionsFormList;
