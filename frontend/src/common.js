import _ from "lodash";
import React from "react";

import * as mc from "../src/constants/mainConstants";

const BMDS_BLANK_VALUE = -9999,
    simulateClick = function(el) {
        // https://gomakethings.com/how-to-simulate-a-click-event-with-javascript/
        const evt = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
        });
        !el.dispatchEvent(evt);
    },
    getHeaders = function(csrfToken) {
        return {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
        };
    },
    readOnlyCheckbox = bool => {
        return <i className={bool ? "fa fa-check-square-o" : "fa fa-square-o"}></i>;
    },
    isParameterBounded = bool => {
        return <i className={bool ? "fa fa-check" : "fa fa-times"}></i>;
    },
    ff = function(value) {
        // ff = float format
        if (value === 0) {
            return value.toString();
        } else if (value == BMDS_BLANK_VALUE || !_.isFinite(value)) {
            return "-";
        } else if (Math.abs(value) > 0.001 && Math.abs(value) < 1e5) {
            // local print "0" for anything smaller than this
            return value.toLocaleString();
        } else {
            // too many 0; use exponential notation
            return value.toExponential(2);
        }
    },
    getLabel = function(value, mapping) {
        return _.find(mapping, d => d.value === value).label;
    },
    getPriorWeightValue = function(models, model) {
        let prior_weight = 0;
        if (mc.BAYESIAN_MODEL_AVERAGE in models) {
            let obj = models[mc.BAYESIAN_MODEL_AVERAGE].find(obj => obj.model === model);

            if (obj != undefined) {
                prior_weight = obj.prior_weight;
            }
        }
        return prior_weight;
    },
    isChecked = function(models, type, model) {
        let checked = false;
        if (type in models) {
            if (type === mc.BAYESIAN_MODEL_AVERAGE) {
                checked = models[type].findIndex(obj => obj.model === model) > -1;
            } else {
                checked = models[type].indexOf(model) > -1;
            }
        }
        return checked;
    };

export {
    simulateClick,
    getHeaders,
    readOnlyCheckbox,
    ff,
    getLabel,
    isParameterBounded,
    getPriorWeightValue,
    isChecked,
};
