import _ from "lodash";
import React from "react";
import {ff, fourDecimalFormatter} from "./utils/formatters";

export {ff, fourDecimalFormatter};
export const simulateClick = function(el) {
        // https://gomakethings.com/how-to-simulate-a-click-event-with-javascript/
        const evt = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
        });
        !el.dispatchEvent(evt);
    },
    randomString = function() {
        return "xxxxxxxxxxxxxxx".replace(/x/g, c =>
            String.fromCharCode(97 + parseInt(26 * Math.random()))
        );
    },
    getHeaders = function(csrfToken) {
        return {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
        };
    },
    checkOrEmpty = bool => {
        // ✓/<null> in box
        return <i className={bool ? "fa fa-check-square-o" : "fa fa-square-o"}></i>;
    },
    checkOrTimes = bool => {
        // ✓/x in box
        return <i className={bool ? "fa fa-check-square-o" : "fa fa-times-rectangle-o"}></i>;
    },
    getLabel = function(value, mapping) {
        return _.find(mapping, d => d.value == value).label;
    };
