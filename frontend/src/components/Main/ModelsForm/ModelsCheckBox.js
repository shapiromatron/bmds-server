import React from "react";
import PropTypes from "prop-types";
import {observer} from "mobx-react";

import * as mc from "../../../constants/mainConstants";
import {getPriorWeightValue, isChecked, readOnlyCheckbox} from "../../../common";

const PriorWeightTd = observer(props => {
    const {store, model} = props;
    return (
        <>
            {store.canEdit ? (
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
            )}
        </>
    );
});

const CheckBoxTd = observer(props => {
    const {store, type, model} = props;
    return (
        <>
            {store.canEdit ? (
                <td>
                    <input
                        type="checkbox"
                        onChange={e => store.setModelSelection(type, model, e.target.checked)}
                        checked={isChecked(store.models, type, model)}></input>
                </td>
            ) : (
                <td>{readOnlyCheckbox(isChecked(store.models, type, model))}</td>
            )}
        </>
    );
});

const ModelsCheckBox = observer(props => {
    const {store} = props;
    return (
        <>
            {store.getModelType === mc.MODEL_CONTINUOUS ? (
                <tbody>
                    <tr>
                        <td className="text-left align-middle">Exponential</td>
                        <CheckBoxTd
                            store={store}
                            type={"frequentist_restricted"}
                            model={"Exponential"}
                        />
                        <td></td>
                        <CheckBoxTd store={store} type={"bayesian"} model={"Exponential"} />
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Hill</td>
                        <CheckBoxTd store={store} type={"frequentist_restricted"} model={"Hill"} />
                        <CheckBoxTd
                            store={store}
                            type={"frequentist_unrestricted"}
                            model={"Hill"}
                        />
                        <CheckBoxTd store={store} type={"bayesian"} model={"Hill"} />
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Linear</td>
                        <td></td>
                        <CheckBoxTd
                            store={store}
                            type={"frequentist_unrestricted"}
                            model={"Linear"}
                        />
                        <CheckBoxTd store={store} type={"bayesian"} model={"Linear"} />
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Polynomial</td>
                        <CheckBoxTd
                            store={store}
                            type={"frequentist_restricted"}
                            model={"Polynomial"}
                        />
                        <CheckBoxTd
                            store={store}
                            type={"frequentist_unrestricted"}
                            model={"Polynomial"}
                        />
                        <CheckBoxTd store={store} type={"bayesian"} model={"Polynomial"} />
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Power</td>
                        <CheckBoxTd store={store} type={"frequentist_restricted"} model={"Power"} />
                        <CheckBoxTd
                            store={store}
                            type={"frequentist_unrestricted"}
                            model={"Power"}
                        />
                        <CheckBoxTd store={store} type={"bayesian"} model={"Power"} />
                    </tr>
                </tbody>
            ) : null}
            {store.getModelType === mc.MODEL_DICHOTOMOUS ? (
                <tbody>
                    <tr>
                        <td className="text-left align-middle">Dichotomous Hill</td>
                        <CheckBoxTd
                            store={store}
                            type={"frequentist_restricted"}
                            model={"Dichotomous-Hill"}
                        />
                        <CheckBoxTd
                            store={store}
                            type={"frequentist_unrestricted"}
                            model={"Dichotomous-Hill"}
                        />
                        <CheckBoxTd store={store} type={"bayesian"} model={"Dichotomous-Hill"} />
                        <CheckBoxTd
                            store={store}
                            type={"bayesian_model_average"}
                            model={"Dichotomous-Hill"}
                        />

                        <PriorWeightTd store={store} model={"Dichotomous-Hill"} />
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Gamma</td>
                        <CheckBoxTd store={store} type={"frequentist_restricted"} model={"Gamma"} />
                        <CheckBoxTd
                            store={store}
                            type={"frequentist_unrestricted"}
                            model={"Gamma"}
                        />
                        <CheckBoxTd store={store} type={"bayesian"} model={"Gamma"} />
                        <CheckBoxTd store={store} type={"bayesian_model_average"} model={"Gamma"} />

                        <PriorWeightTd store={store} model={"Gamma"} />
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Logistic</td>
                        <td></td>
                        <CheckBoxTd
                            store={store}
                            type={"frequentist_unrestricted"}
                            model={"Logistic"}
                        />
                        <CheckBoxTd store={store} type={"bayesian"} model={"Logistic"} />
                        <CheckBoxTd
                            store={store}
                            type={"bayesian_model_average"}
                            model={"Logistic"}
                        />
                        <PriorWeightTd store={store} model={"Logistic"} />
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Log Logistic</td>
                        <CheckBoxTd
                            store={store}
                            type={"frequentist_restricted"}
                            model={"LogLogistic"}
                        />
                        <CheckBoxTd
                            store={store}
                            type={"frequentist_unrestricted"}
                            model={"LogLogistic"}
                        />
                        <CheckBoxTd store={store} type={"bayesian"} model={"LogLogistic"} />
                        <CheckBoxTd
                            store={store}
                            type={"bayesian_model_average"}
                            model={"LogLogistic"}
                        />

                        <PriorWeightTd store={store} model={"LogLogistic"} />
                    </tr>
                    <tr>
                        <td className="text-left align-middle">LogProbit</td>
                        <CheckBoxTd
                            store={store}
                            type={"frequentist_restricted"}
                            model={"LogProbit"}
                        />
                        <CheckBoxTd
                            store={store}
                            type={"frequentist_unrestricted"}
                            model={"LogProbit"}
                        />
                        <CheckBoxTd store={store} type={"bayesian"} model={"LogProbit"} />
                        <CheckBoxTd
                            store={store}
                            type={"bayesian_model_average"}
                            model={"LogProbit"}
                        />

                        <PriorWeightTd store={store} model={"LogProbit"} />
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Multistage</td>
                        <CheckBoxTd
                            store={store}
                            type={"frequentist_restricted"}
                            model={"Multistage"}
                        />
                        <CheckBoxTd
                            store={store}
                            type={"frequentist_unrestricted"}
                            model={"Multistage"}
                        />
                        <CheckBoxTd store={store} type={"bayesian"} model={"Multistage"} />
                        <CheckBoxTd
                            store={store}
                            type={"bayesian_model_average"}
                            model={"Multistage"}
                        />

                        <PriorWeightTd store={store} model={"Multistage"} />
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Probit</td>
                        <td></td>

                        <CheckBoxTd
                            store={store}
                            type={"frequentist_unrestricted"}
                            model={"Probit"}
                        />
                        <CheckBoxTd store={store} type={"bayesian"} model={"Probit"} />
                        <CheckBoxTd
                            store={store}
                            type={"bayesian_model_average"}
                            model={"Probit"}
                        />

                        <PriorWeightTd store={store} model={"Probit"} />
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Quantal Linear</td>
                        <td></td>

                        <CheckBoxTd
                            store={store}
                            type={"frequentist_unrestricted"}
                            model={"QuantalLinear"}
                        />
                        <CheckBoxTd store={store} type={"bayesian"} model={"QuantalLinear"} />
                        <CheckBoxTd
                            store={store}
                            type={"bayesian_model_average"}
                            model={"QuantalLinear"}
                        />

                        <PriorWeightTd store={store} model={"QuantalLinear"} />
                    </tr>
                    <tr>
                        <td className="text-left align-middle">Weibull</td>
                        <CheckBoxTd
                            store={store}
                            type={"frequentist_restricted"}
                            model={"Weibull"}
                        />
                        <CheckBoxTd
                            store={store}
                            type={"frequentist_unrestricted"}
                            model={"Weibull"}
                        />
                        <CheckBoxTd store={store} type={"bayesian"} model={"Weibull"} />
                        <CheckBoxTd
                            store={store}
                            type={"bayesian_model_average"}
                            model={"Weibull"}
                        />

                        <PriorWeightTd store={store} model={"Weibull"} />
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
