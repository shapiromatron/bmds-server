import React from "react";
import PropTypes from "prop-types";
import {observer} from "mobx-react";

import * as mc from "../../../constants/mainConstants";
import {getPriorWeightValue, isChecked, readOnlyCheckbox} from "../../../common";

const PriorWeightTd = observer(props => {
        const {store, model} = props;
        return store.canEdit ? (
            <td>
                <input
                    value={getPriorWeightValue(store.models, model)}
                    onChange={e => store.setPriorWeight(model, e.target.value)}
                    type="number"
                    className="form-control form-control-sm align-middle  pl-1"
                />
            </td>
        ) : (
            <td>{getPriorWeightValue(store.models, model)}</td>
        );
    }),
    CheckBoxTd = observer(props => {
        const {store, type, model} = props;
        return store.canEdit ? (
            <td>
                <input
                    type="checkbox"
                    onChange={e => store.setModelSelection(type, model, e.target.checked)}
                    checked={isChecked(store.models, type, model)}></input>
            </td>
        ) : (
            <td>{readOnlyCheckbox(isChecked(store.models, type, model))}</td>
        );
    }),
    fr = "frequentist_restricted",
    fu = "frequentist_unrestricted",
    b = "bayesian",
    bma = "bayesian_model_average";

const ModelsCheckBox = observer(props => {
    const {store} = props;
    if (store.getModelType === mc.MODEL_CONTINUOUS) {
        return (
            <tbody>
                <tr>
                    <td className="text-left align-middle">Exponential</td>
                    <CheckBoxTd store={store} type={fr} model={"Exponential"} />
                    <td></td>
                    <CheckBoxTd store={store} type={b} model={"Exponential"} />
                </tr>
                <tr>
                    <td className="text-left align-middle">Hill</td>
                    <CheckBoxTd store={store} type={fr} model={"Hill"} />
                    <CheckBoxTd store={store} type={fu} model={"Hill"} />
                    <CheckBoxTd store={store} type={b} model={"Hill"} />
                </tr>
                <tr>
                    <td className="text-left align-middle">Linear</td>
                    <td></td>
                    <CheckBoxTd store={store} type={fu} model={"Linear"} />
                    <CheckBoxTd store={store} type={b} model={"Linear"} />
                </tr>
                <tr>
                    <td className="text-left align-middle">Polynomial</td>
                    <CheckBoxTd store={store} type={fr} model={"Polynomial"} />
                    <CheckBoxTd store={store} type={fu} model={"Polynomial"} />
                    <CheckBoxTd store={store} type={b} model={"Polynomial"} />
                </tr>
                <tr>
                    <td className="text-left align-middle">Power</td>
                    <CheckBoxTd store={store} type={fr} model={"Power"} />
                    <CheckBoxTd store={store} type={fu} model={"Power"} />
                    <CheckBoxTd store={store} type={b} model={"Power"} />
                </tr>
            </tbody>
        );
    }
    if (store.getModelType === mc.MODEL_DICHOTOMOUS) {
        return (
            <tbody>
                <tr>
                    <td className="text-left align-middle">Dichotomous Hill</td>
                    <CheckBoxTd store={store} type={fr} model={"Dichotomous-Hill"} />
                    <CheckBoxTd store={store} type={fu} model={"Dichotomous-Hill"} />
                    <CheckBoxTd store={store} type={b} model={"Dichotomous-Hill"} />
                    <CheckBoxTd store={store} type={bma} model={"Dichotomous-Hill"} />

                    <PriorWeightTd store={store} model={"Dichotomous-Hill"} />
                </tr>
                <tr>
                    <td className="text-left align-middle">Gamma</td>
                    <CheckBoxTd store={store} type={fr} model={"Gamma"} />
                    <CheckBoxTd store={store} type={fu} model={"Gamma"} />
                    <CheckBoxTd store={store} type={b} model={"Gamma"} />
                    <CheckBoxTd store={store} type={bma} model={"Gamma"} />
                    <PriorWeightTd store={store} model={"Gamma"} />
                </tr>
                <tr>
                    <td className="text-left align-middle">Logistic</td>
                    <td></td>
                    <CheckBoxTd store={store} type={fu} model={"Logistic"} />
                    <CheckBoxTd store={store} type={b} model={"Logistic"} />
                    <CheckBoxTd store={store} type={bma} model={"Logistic"} />
                    <PriorWeightTd store={store} model={"Logistic"} />
                </tr>
                <tr>
                    <td className="text-left align-middle">Log Logistic</td>
                    <CheckBoxTd store={store} type={fr} model={"LogLogistic"} />
                    <CheckBoxTd store={store} type={fu} model={"LogLogistic"} />
                    <CheckBoxTd store={store} type={b} model={"LogLogistic"} />
                    <CheckBoxTd store={store} type={bma} model={"LogLogistic"} />
                    <PriorWeightTd store={store} model={"LogLogistic"} />
                </tr>
                <tr>
                    <td className="text-left align-middle">LogProbit</td>
                    <CheckBoxTd store={store} type={fr} model={"LogProbit"} />
                    <CheckBoxTd store={store} type={fu} model={"LogProbit"} />
                    <CheckBoxTd store={store} type={b} model={"LogProbit"} />
                    <CheckBoxTd store={store} type={bma} model={"LogProbit"} />
                    <PriorWeightTd store={store} model={"LogProbit"} />
                </tr>
                <tr>
                    <td className="text-left align-middle">Multistage</td>
                    <CheckBoxTd store={store} type={fr} model={"Multistage"} />
                    <CheckBoxTd store={store} type={fu} model={"Multistage"} />
                    <CheckBoxTd store={store} type={b} model={"Multistage"} />
                    <CheckBoxTd store={store} type={bma} model={"Multistage"} />
                    <PriorWeightTd store={store} model={"Multistage"} />
                </tr>
                <tr>
                    <td className="text-left align-middle">Probit</td>
                    <td></td>
                    <CheckBoxTd store={store} type={fu} model={"Probit"} />
                    <CheckBoxTd store={store} type={b} model={"Probit"} />
                    <CheckBoxTd store={store} type={bma} model={"Probit"} />
                    <PriorWeightTd store={store} model={"Probit"} />
                </tr>
                <tr>
                    <td className="text-left align-middle">Quantal Linear</td>
                    <td></td>
                    <CheckBoxTd store={store} type={fu} model={"QuantalLinear"} />
                    <CheckBoxTd store={store} type={b} model={"QuantalLinear"} />
                    <CheckBoxTd store={store} type={bma} model={"QuantalLinear"} />
                    <PriorWeightTd store={store} model={"QuantalLinear"} />
                </tr>
                <tr>
                    <td className="text-left align-middle">Weibull</td>
                    <CheckBoxTd store={store} type={fr} model={"Weibull"} />
                    <CheckBoxTd store={store} type={fu} model={"Weibull"} />
                    <CheckBoxTd store={store} type={b} model={"Weibull"} />
                    <CheckBoxTd store={store} type={bma} model={"Weibull"} />
                    <PriorWeightTd store={store} model={"Weibull"} />
                </tr>
            </tbody>
        );
    }

    throw `Unknown modelType: ${store.getModelType}`;
});
ModelsCheckBox.propTypes = {
    store: PropTypes.any,
};
export default ModelsCheckBox;
