import _ from "lodash";
import React from "react";

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
    };

export {simulateClick, getHeaders, readOnlyCheckbox, ff, getLabel};
