import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import {toJS} from "mobx";

import OptionsForm from "./OptionsForm";
import OptionsReadOnly from "./OptionsReadOnly";
import HelpTextPopover from "../../common/HelpTextPopover";
import {
    MODEL_CONTINUOUS,
    MODEL_DICHOTOMOUS,
    MODEL_NESTED_DICHOTOMOUS,
} from "../../../constants/mainConstants";
import Button from "../../common/Button";

@inject("optionsStore")
@observer
class OptionsFormList extends Component {
    render() {
        const {optionsStore} = this.props,
            modelType = optionsStore.getModelType,
            optionsList = toJS(optionsStore.optionsList),
            distTypeHelpText =
                "If lognormal is selected, only the Exponential and Hill models can be executed. Other models will be removed during the execution process and will not be shown in the outputs.";
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
                                                <HelpTextPopover content={distTypeHelpText} />
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
                                    {modelType === MODEL_NESTED_DICHOTOMOUS ? (
                                        <>
                                            <th>Risk Type</th>
                                            <th>BMR</th>
                                            <th>Confidence Level</th>
                                            <th>
                                                Litter Specific
                                                <br />
                                                Covariate
                                            </th>
                                            <th>Background</th>
                                            <th>
                                                Bootstrap
                                                <br />
                                                Iterations
                                            </th>
                                            <th>Bootstrap Seed</th>
                                        </>
                                    ) : null}
                                    {optionsStore.canEdit ? (
                                        <th>
                                            <Button
                                                datatoggle="tooltip"
                                                placement="right"
                                                className="btn btn-primary"
                                                disabled={!optionsStore.canAddNewOption}
                                                onClick={optionsStore.addOptions}
                                                faClass="fa fa-plus"
                                            />
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
