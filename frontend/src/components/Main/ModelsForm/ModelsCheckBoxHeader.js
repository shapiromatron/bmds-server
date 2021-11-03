import React from "react";
import PropTypes from "prop-types";
import {observer} from "mobx-react";

import {allModelOptions} from "../../../constants/modelConstants";
import * as mc from "../../../constants/mainConstants";
import HelpTextPopover from "../../common/HelpTextPopover";
import CheckboxInput from "../../common/CheckboxInput";

const areAllModelsChecked = function(modelType, type, models) {
        return type in models && models[type].length === allModelOptions[modelType][type].length;
    },
    SelectAllComponent = observer(props => {
        const {store, type, disabled} = props;
        return store.canEdit ? (
            <th>
                <label className="m-0">
                    <CheckboxInput
                        disabled={disabled}
                        onChange={value => store.enableAll(type, value)}
                        checked={areAllModelsChecked(store.getModelType, type, store.models)}
                    />
                    &nbsp;Select all
                </label>
            </th>
        ) : (
            <th></th>
        );
    });

const ModelsCheckBoxHeader = observer(props => {
    const {store} = props,
        content =
            "Models were previewed in BMDS 3.2 and will be formally peer reviewed. EPA plans to release the final models in 2022.",
        title = "Bayesian Model Averaging",
        {hasBayesianModels} = store,
        isContinuous = store.getModelType === mc.MODEL_CONTINUOUS,
        isMultiTumor = store.getModelType === mc.MODEL_MULTI_TUMOR;
    return (
        <thead className="bg-custom">
            <tr>
                <th></th>
                <th colSpan="2">MLE</th>
                {hasBayesianModels ? <th colSpan="3">Alternatives</th> : null}
            </tr>
            <tr>
                <th></th>
                <th>Frequentist Restricted</th>
                <th>Frequentist Unrestricted</th>
                {hasBayesianModels ? (
                    <th colSpan="2">
                        Bayesian Model Averaging
                        {isContinuous ? (
                            <HelpTextPopover title={title} content={content}></HelpTextPopover>
                        ) : null}
                    </th>
                ) : null}
            </tr>
            <tr>
                <th>Models</th>
                <SelectAllComponent store={store} type={"frequentist_restricted"} />
                <SelectAllComponent
                    store={store}
                    type={"frequentist_unrestricted"}
                    disabled={isMultiTumor}
                />
                {hasBayesianModels ? (
                    <>
                        <SelectAllComponent
                            store={store}
                            type={"bayesian"}
                            disabled={isContinuous}
                        />
                        <th>Prior Weights</th>
                    </>
                ) : null}
            </tr>
        </thead>
    );
});
ModelsCheckBoxHeader.propTypes = {
    store: PropTypes.object,
};
export default ModelsCheckBoxHeader;
