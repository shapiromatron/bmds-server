import React from "react";
import PropTypes from "prop-types";
import {observer} from "mobx-react";

import {modelsList} from "../../../constants/modelConstants";
import * as mc from "../../../constants/mainConstants";

const ModelsCheckBoxHeader = observer(props => {
    const {store} = props,
        isChecked = function(name) {
            let checked = false;
            if (name in store.models) {
                checked = store.models[name].length === modelsList[store.getModelType].length;
            }
            return checked;
        };
    return (
        <thead className="table-primary">
            <tr>
                <th></th>
                <th colSpan="2">MLE</th>
                <th colSpan="3"> Alternatives</th>
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
                <th>
                    <input
                        type="checkbox"
                        onChange={e =>
                            props.store.enableAll("frequentist_restricted", e.target.checked)
                        }
                        checked={isChecked("frequentist_restricted")}
                    />
                    Enable
                </th>
                <th>
                    <input
                        type="checkbox"
                        onChange={e =>
                            props.store.enableAll("frequentist_unrestricted", e.target.checked)
                        }
                        checked={isChecked("frequentist_unrestricted")}
                    />
                    Enable
                </th>
                <th>
                    <input
                        type="checkbox"
                        onChange={e => props.store.enableAll("bayesian", e.target.checked)}
                        checked={isChecked("bayesian")}
                    />
                    Enable
                </th>

                {store.getModelType === mc.MODEL_DICHOTOMOUS ? (
                    <>
                        <th>
                            <input
                                type="checkbox"
                                onChange={e =>
                                    props.store.enableAll(
                                        "bayesian_model_average",
                                        e.target.checked
                                    )
                                }
                                checked={isChecked("bayesian_model_average")}
                            />
                            Enable
                        </th>
                        <th>Prior Weights</th>
                    </>
                ) : null}
            </tr>
        </thead>
    );
});
ModelsCheckBoxHeader.propTypes = {
    model_headers: PropTypes.object,
    model: PropTypes.string,
    values: PropTypes.array,
    isEditSettings: PropTypes.bool,
    onChange: PropTypes.func,
    enableAll: PropTypes.func,
};
export default ModelsCheckBoxHeader;
