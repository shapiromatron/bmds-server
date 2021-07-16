import React from "react";
import PropTypes from "prop-types";
import {observer} from "mobx-react";

import {allModelOptions} from "../../../constants/modelConstants";
import * as mc from "../../../constants/mainConstants";
import HelpTextPopover from "../../common/HelpTextPopover";

const areAllModelsChecked = function(modelType, type, models) {
        return type in models && models[type].length === allModelOptions[modelType][type].length;
    },
    SelectAllComponent = observer(props => {
        const {store, type} = props;
        return store.canEdit ? (
            <th>
                <label className="m-0">
                    <input
                        type="checkbox"
                        disabled={type === "bayesian" && store.getModelType === "C" ? true : false}
                        onChange={e => store.enableAll(type, e.target.checked)}
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
        title = "Bayesian";
    return (
        <thead className="bg-custom">
            <tr>
                <th></th>
                <th colSpan="2">MLE</th>
                <th colSpan="3">Alternatives</th>
            </tr>
            <tr>
                <th></th>
                <th>Frequentist Restricted</th>
                <th>Frequentist Unrestricted</th>
                <th colSpan="2">
                    Bayesian Model Averaging
                    {store.getModelType === "C" ? (
                        <HelpTextPopover title={title} content={content}></HelpTextPopover>
                    ) : null}
                </th>
            </tr>
            <tr>
                <th>Models</th>
                <SelectAllComponent store={store} type={"frequentist_restricted"} />
                <SelectAllComponent store={store} type={"frequentist_unrestricted"} />
                <SelectAllComponent store={store} type={"bayesian"} />
                {store.getModelType === mc.MODEL_DICHOTOMOUS ? (
                    <>
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
