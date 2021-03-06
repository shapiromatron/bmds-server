import React from "react";
import PropTypes from "prop-types";
import {observer} from "mobx-react";

import {allModelOptions} from "../../../constants/modelConstants";
import * as mc from "../../../constants/mainConstants";

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
    const {store} = props;
    return (
        <thead className="table-primary">
            <tr>
                <th></th>
                <th colSpan="2">MLE</th>
                <th colSpan="3">Alternatives</th>
            </tr>
            <tr>
                <th></th>
                <th>Frequentist Restricted</th>
                <th>Frequentist Unrestricted</th>
                <th>Bayesian</th>
                {store.getModelType === mc.MODEL_DICHOTOMOUS ? (
                    <th colSpan="2">Bayesian Model Average</th>
                ) : null}
            </tr>
            <tr>
                <th>Models</th>
                <SelectAllComponent store={store} type={"frequentist_restricted"} />
                <SelectAllComponent store={store} type={"frequentist_unrestricted"} />
                <SelectAllComponent store={store} type={"bayesian"} />
                {store.getModelType === mc.MODEL_DICHOTOMOUS ? (
                    <>
                        <SelectAllComponent store={store} type={"bayesian_model_average"} />
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
