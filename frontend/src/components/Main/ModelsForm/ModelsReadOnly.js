import React from "react";
import PropTypes from "prop-types";
import {observer} from "mobx-react";
import {readOnlyCheckbox} from "../../../common";

import * as mc from "../../../constants/mainConstants";

const ModelsReadOnly = observer(props => {
    const {store} = props,
        isChecked = function(name, model) {
            let checked = false;
            if (name in store.models) {
                if (name === mc.BAYESIAN_MODEL_AVERAGE) {
                    checked = store.models[name].findIndex(obj => obj.model === model) > -1;
                } else {
                    checked = store.models[name].indexOf(model) > -1;
                }
            }
            return checked;
        },
        getPriorWeightValue = function(model) {
            let prior_weight = 0;
            if (mc.BAYESIAN_MODEL_AVERAGE in store.models) {
                let obj = store.models[mc.BAYESIAN_MODEL_AVERAGE].find(obj => obj.model === model);

                if (obj != undefined) {
                    prior_weight = obj.prior_weight;
                }
            }

            return prior_weight;
        };
    return (
        <>
            {store.getModelType === mc.MODEL_CONTINUOUS ? (
                <tbody>
                    <tr>
                        <td className="text-left align-middle">Exponential</td>
                        <td>
                            {readOnlyCheckbox(isChecked("frequentist_restricted", "Exponential"))}
                        </td>
                        <td></td>
                        <td>{readOnlyCheckbox(isChecked("bayesian", "Exponential"))}</td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Hill</td>
                        <td>{readOnlyCheckbox(isChecked("frequentist_restricted", "Hill"))}</td>
                        <td>{readOnlyCheckbox(isChecked("frequentist_unrestricted", "Hill"))}</td>
                        <td>{readOnlyCheckbox(isChecked("bayesian", "Hill"))}</td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Linear</td>
                        <td></td>
                        <td>{readOnlyCheckbox(isChecked("frequentist_unrestricted", "Linear"))}</td>
                        <td>{readOnlyCheckbox(isChecked("bayesian", "Linear"))}</td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Polynomial</td>
                        <td>
                            {readOnlyCheckbox(isChecked("frequentist_restricted", "Polynomial"))}
                        </td>
                        <td>
                            {readOnlyCheckbox(isChecked("frequentist_unrestricted", "Polynomial"))}
                        </td>
                        <td>{readOnlyCheckbox(isChecked("bayesian", "Polynomial"))}</td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Power</td>
                        <td>{readOnlyCheckbox(isChecked("frequentist_restricted", "Power"))}</td>
                        <td></td>
                        <td>{readOnlyCheckbox(isChecked("bayesian", "Power"))}</td>
                    </tr>
                </tbody>
            ) : null}
            {store.getModelType === mc.MODEL_DICHOTOMOUS ? (
                <tbody>
                    <tr>
                        <td className="text-left align-middle">Dichotomous Hill</td>
                        <td>
                            {readOnlyCheckbox(
                                isChecked("frequentist_restricted", "ExponeDichotomous-Hillntial")
                            )}
                        </td>
                        <td>
                            {readOnlyCheckbox(
                                isChecked("frequentist_unrestricted", "Dichotomous-Hill")
                            )}
                        </td>
                        <td>{readOnlyCheckbox(isChecked("bayesian", "Dichotomous-Hill"))}</td>
                        <td>
                            {readOnlyCheckbox(
                                isChecked("bayesian_model_average", "Dichotomous-Hill")
                            )}
                        </td>
                        <td>{getPriorWeightValue("Dichotomous-Hill")}</td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Gamma</td>
                        <td>{readOnlyCheckbox(isChecked("frequentist_restricted", "Gamma"))}</td>
                        <td>{readOnlyCheckbox(isChecked("frequentist_unrestricted", "Gamma"))}</td>
                        <td>{readOnlyCheckbox(isChecked("bayesian", "Gamma"))}</td>
                        <td>{readOnlyCheckbox(isChecked("bayesian_model_average", "Gamma"))}</td>
                        <td>{getPriorWeightValue("Gamma")}</td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Logistic</td>
                        <td>{readOnlyCheckbox(isChecked("frequentist_restricted", "Logistic"))}</td>
                        <td>
                            {readOnlyCheckbox(isChecked("frequentist_unrestricted", "Logistic"))}
                        </td>
                        <td>{readOnlyCheckbox(isChecked("bayesian", "Logistic"))}</td>
                        <td>{readOnlyCheckbox(isChecked("bayesian_model_average", "Logistic"))}</td>
                        <td>{getPriorWeightValue("Logistic")}</td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Log Logistic</td>
                        <td>
                            {readOnlyCheckbox(isChecked("frequentist_restricted", "LogLogistic"))}
                        </td>
                        <td>
                            {readOnlyCheckbox(isChecked("frequentist_unrestricted", "LogLogistic"))}
                        </td>
                        <td>{readOnlyCheckbox(isChecked("bayesian", "LogLogistic"))}</td>
                        <td>
                            {readOnlyCheckbox(isChecked("bayesian_model_average", "LogLogistic"))}
                        </td>
                        <td>{getPriorWeightValue("LogLogistic")}</td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">LogProbit</td>
                        <td>
                            {readOnlyCheckbox(isChecked("frequentist_restricted", "LogProbit"))}
                        </td>
                        <td>
                            {readOnlyCheckbox(isChecked("frequentist_unrestricted", "LogProbit"))}
                        </td>
                        <td>{readOnlyCheckbox(isChecked("bayesian", "LogProbit"))}</td>
                        <td>
                            {readOnlyCheckbox(isChecked("bayesian_model_average", "LogProbit"))}
                        </td>
                        <td>{getPriorWeightValue("LogProbit")}</td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Multistage</td>
                        <td>
                            {readOnlyCheckbox(isChecked("frequentist_restricted", "Multistage"))}
                        </td>
                        <td>
                            {readOnlyCheckbox(isChecked("frequentist_unrestricted", "Multistage"))}
                        </td>
                        <td>{readOnlyCheckbox(isChecked("bayesian", "Multistage"))}</td>
                        <td>
                            {readOnlyCheckbox(isChecked("bayesian_model_average", "Multistage"))}
                        </td>
                        <td>{getPriorWeightValue("Multistage")}</td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Probit</td>
                        <td></td>
                        <td>{readOnlyCheckbox(isChecked("frequentist_unrestricted", "Probit"))}</td>
                        <td>{readOnlyCheckbox(isChecked("bayesian", "Probit"))}</td>
                        <td>{readOnlyCheckbox(isChecked("bayesian_model_average", "Probit"))}</td>
                        <td>{getPriorWeightValue("Probit")}</td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Quantal Linear</td>
                        <td></td>
                        <td>
                            {readOnlyCheckbox(
                                isChecked("frequentist_unrestricted", "QuantalLinear")
                            )}
                        </td>
                        <td>{readOnlyCheckbox(isChecked("bayesian", "QuantalLinear"))}</td>
                        <td>
                            {readOnlyCheckbox(isChecked("bayesian_model_average", "QuantalLinear"))}
                        </td>
                        <td>{getPriorWeightValue("QuantalLinear")}</td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Weibull</td>
                        <td>{readOnlyCheckbox(isChecked("frequentist_restricted", "Weibull"))}</td>
                        <td>
                            {readOnlyCheckbox(isChecked("frequentist_unrestricted", "Weibull"))}
                        </td>
                        <td>{readOnlyCheckbox(isChecked("bayesian", "Weibull"))}</td>
                        <td>{readOnlyCheckbox(isChecked("bayesian_model_average", "Weibull"))}</td>
                        <td>{getPriorWeightValue("Weibull")}</td>
                    </tr>
                </tbody>
            ) : null}
        </>
    );
});
ModelsReadOnly.proptTypes = {
    store: PropTypes.any,
};
export default ModelsReadOnly;
