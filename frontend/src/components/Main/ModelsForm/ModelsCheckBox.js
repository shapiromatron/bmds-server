import React from "react";
import PropTypes from "prop-types";
import {observer} from "mobx-react";

import * as mc from "../../../constants/mainConstants";

const ModelsCheckBox = observer(props => {
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
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "frequentist_restricted",
                                        "Exponential",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked(
                                    "frequentist_restricted",
                                    "Exponential"
                                )}></input>
                        </td>
                        <td></td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "bayesian",
                                        "Exponential",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("bayesian", "Exponential")}></input>
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Hill</td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "frequentist_restricted",
                                        "Hill",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("frequentist_restricted", "Hill")}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "frequentist_unrestricted",
                                        "Hill",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("frequentist_unrestricted", "Hill")}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection("bayesian", "Hill", e.target.checked)
                                }
                                checked={isChecked("bayesian", "Hill")}></input>
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Linear</td>
                        <td></td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "frequentist_unrestricted",
                                        "Linear",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("frequentist_unrestricted", "Linear")}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection("bayesian", "Linear", e.target.checked)
                                }
                                checked={isChecked("bayesian", "Linear")}></input>
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Polynomial</td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "frequentist_restricted",
                                        "Polynomial",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("frequentist_restricted", "Polynomial")}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "frequentist_unrestricted",
                                        "Polynomial",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked(
                                    "frequentist_unrestricted",
                                    "Polynomial"
                                )}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "bayesian",
                                        "Polynomial",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("bayesian", "Polynomial")}></input>
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Power</td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "frequentist_restricted",
                                        "Power",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("frequentist_restricted", "Power")}></input>
                        </td>
                        <td></td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection("bayesian", "Power", e.target.checked)
                                }
                                checked={isChecked("bayesian", "Power")}></input>
                        </td>
                    </tr>
                </tbody>
            ) : null}
            {store.getModelType === mc.MODEL_DICHOTOMOUS ? (
                <tbody>
                    <tr>
                        <td className="text-left align-middle">Dichotomous Hill</td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "frequentist_restricted",
                                        "Dichotomous-Hill",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked(
                                    "frequentist_restricted",
                                    "Dichotomous-Hill"
                                )}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "frequentist_unrestricted",
                                        "Dichotomous-Hill",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked(
                                    "frequentist_unrestricted",
                                    "Dichotomous-Hill"
                                )}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "bayesian",
                                        "Dichotomous-Hill",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("bayesian", "Dichotomous-Hill")}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "bayesian_model_average",
                                        "Dichotomous-Hill",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked(
                                    "bayesian_model_average",
                                    "Dichotomous-Hill"
                                )}></input>
                        </td>
                        <td>
                            <input
                                value={getPriorWeightValue("Dichotomous-Hill")}
                                onChange={e =>
                                    store.setPriorWeight("Dichotomous-Hill", e.target.value)
                                }
                                type="number"
                                className="form-control form-control-sm align-middle  pl-1"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Gamma</td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "frequentist_restricted",
                                        "Gamma",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("frequentist_restricted", "Gamma")}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "frequentist_unrestricted",
                                        "Gamma",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("frequentist_unrestricted", "Gamma")}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection("bayesian", "Gamma", e.target.checked)
                                }
                                checked={isChecked("bayesian", "Gamma")}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "bayesian_model_average",
                                        "Gamma",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("bayesian_model_average", "Gamma")}></input>
                        </td>
                        <td>
                            <input
                                value={getPriorWeightValue("Gamma")}
                                onChange={e => store.setPriorWeight("Gamma", e.target.value)}
                                type="number"
                                className="form-control form-control-sm align-middle  pl-1"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Logistic</td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "frequentist_restricted",
                                        "Logistic",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("frequentist_restricted", "Logistic")}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "frequentist_unrestricted",
                                        "Logistic",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("frequentist_unrestricted", "Logistic")}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "bayesian",
                                        "Logistic",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("bayesian", "Logistic")}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "bayesian_model_average",
                                        "Logistic",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("bayesian_model_average", "Logistic")}></input>
                        </td>
                        <td>
                            <input
                                value={getPriorWeightValue("Logistic")}
                                onChange={e => store.setPriorWeight("Logistic", e.target.value)}
                                type="number"
                                className="form-control form-control-sm align-middle  pl-1"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Log Logistic</td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "frequentist_restricted",
                                        "LogLogistic",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked(
                                    "frequentist_restricted",
                                    "LogLogistic"
                                )}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "frequentist_unrestricted",
                                        "LogLogistic",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked(
                                    "frequentist_unrestricted",
                                    "LogLogistic"
                                )}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "bayesian",
                                        "LogLogistic",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("bayesian", "LogLogistic")}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "bayesian_model_average",
                                        "LogLogistic",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked(
                                    "bayesian_model_average",
                                    "LogLogistic"
                                )}></input>
                        </td>
                        <td>
                            <input
                                value={getPriorWeightValue("LogLogistic")}
                                onChange={e => store.setPriorWeight("LogLogistic", e.target.value)}
                                type="number"
                                className="form-control form-control-sm align-middle  pl-1"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">LogProbit</td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "frequentist_restricted",
                                        "LogProbit",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("frequentist_restricted", "LogProbit")}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "frequentist_unrestricted",
                                        "LogProbit",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked(
                                    "frequentist_unrestricted",
                                    "LogProbit"
                                )}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "bayesian",
                                        "LogProbit",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("bayesian", "LogProbit")}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "bayesian_model_average",
                                        "LogProbit",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("bayesian_model_average", "LogProbit")}></input>
                        </td>
                        <td>
                            <input
                                value={getPriorWeightValue("LogProbit")}
                                onChange={e => store.setPriorWeight("LogProbit", e.target.value)}
                                type="number"
                                className="form-control form-control-sm align-middle  pl-1"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Multistage</td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "frequentist_restricted",
                                        "Multistage",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("frequentist_restricted", "Multistage")}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "frequentist_unrestricted",
                                        "Multistage",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked(
                                    "frequentist_unrestricted",
                                    "Multistage"
                                )}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "bayesian",
                                        "Multistage",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("bayesian", "Multistage")}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "bayesian_model_average",
                                        "Multistage",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("bayesian_model_average", "Multistage")}></input>
                        </td>
                        <td>
                            <input
                                value={getPriorWeightValue("Multistage")}
                                onChange={e => store.setPriorWeight("Multistage", e.target.value)}
                                type="number"
                                className="form-control form-control-sm align-middle  pl-1"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Probit</td>
                        <td></td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "frequentist_unrestricted",
                                        "Probit",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("frequentist_unrestricted", "Probit")}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection("bayesian", "Probit", e.target.checked)
                                }
                                checked={isChecked("bayesian", "Probit")}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "bayesian_model_average",
                                        "Probit",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("bayesian_model_average", "Probit")}></input>
                        </td>
                        <td>
                            <input
                                value={getPriorWeightValue("Probit")}
                                onChange={e => store.setPriorWeight("Probit", e.target.value)}
                                type="number"
                                className="form-control form-control-sm align-middle  pl-1"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Quantal Linear</td>
                        <td></td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "frequentist_unrestricted",
                                        "QuantalLinear",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked(
                                    "frequentist_unrestricted",
                                    "QuantalLinear"
                                )}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "bayesian",
                                        "QuantalLinear",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("bayesian", "QuantalLinear")}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "bayesian_model_average",
                                        "QuantalLinear",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked(
                                    "bayesian_model_average",
                                    "QuantalLinear"
                                )}></input>
                        </td>
                        <td>
                            <input
                                value={getPriorWeightValue("QuantalLinear")}
                                onChange={e =>
                                    store.setPriorWeight("QuantalLinear", e.target.value)
                                }
                                type="number"
                                className="form-control form-control-sm align-middle  pl-1"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Weibull</td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "frequentist_restricted",
                                        "Weibull",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("frequentist_restricted", "Weibull")}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "frequentist_unrestricted",
                                        "Weibull",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("frequentist_unrestricted", "Weibull")}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection("bayesian", "Weibull", e.target.checked)
                                }
                                checked={isChecked("bayesian", "Weibull")}></input>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    store.setModelSelection(
                                        "bayesian_model_average",
                                        "Weibull",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("bayesian_model_average", "Weibull")}></input>
                        </td>
                        <td>
                            <input
                                value={getPriorWeightValue("Weibull")}
                                onChange={e => store.setPriorWeight("Weibull", e.target.value)}
                                type="number"
                                className="form-control form-control-sm align-middle  pl-1"
                            />
                        </td>
                    </tr>
                </tbody>
            ) : null}
        </>
    );
});
ModelsCheckBox.propTypes = {
    store: PropTypes.any,
};
export default ModelsCheckBox;
