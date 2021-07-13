import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import {toJS} from "mobx";

import OptionsForm from "./OptionsForm";
import OptionsReadOnly from "./OptionsReadOnly";
import HelpTextPopup from "../../common/HelpTextPopup";
import {MODEL_CONTINUOUS, MODEL_DICHOTOMOUS} from "../../../constants/mainConstants";

@inject("optionsStore")
@observer
class OptionsFormList extends Component {
    render() {
        const {optionsStore} = this.props,
            modelType = optionsStore.getModelType,
            optionsList = toJS(optionsStore.optionsList),
            distTypeHelpText =
                "If lognormal is selected, only the Exponential and Hill models can be executed";
        return (
            <div>
                <div className="panel panel-default">
                    <form className="form-horizontal">
                        <table className="options-table table table-bordered table-sm text-center">
                            <thead className="bg-custom">
                                <tr>
                                    {modelType === MODEL_CONTINUOUS ? (
                                        <>
                                            <th>BMR Type</th>
                                            <th>BMRF</th>
                                            <th>Tail Probability</th>
                                            <th>Confidence Level</th>
                                            <th>
                                                Distribution +<br />
                                                Variance&nbsp;
                                                <HelpTextPopup content={distTypeHelpText} />
                                            </th>
                                        </>
                                    ) : null}
                                    {modelType === MODEL_DICHOTOMOUS ? (
                                        <>
                                            <th>Risk Type</th>
                                            <th>BMR</th>
                                            <th>Confidence Level</th>
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
