import _ from "lodash";
import React from "react";

import Icon from "./components/common/Icon";

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
        return <Icon name={bool ? "check2-square" : "square"} classes="bi-lg" />;
    },
    getLabel = function(value, mapping) {
        return _.find(mapping, d => d.value == value).label;
    },
    parseErrors = errorText => {
        let errors = [],
            textErrors = [];
        try {
            errors = JSON.parse(errorText);
        } catch {
            console.error("Cannot parse error response");
            return {errors, textErrors};
        }
        textErrors = errors.map(error => {
            if (error.loc && error.msg) {
                return `${error.loc[0]}: ${error.msg}`;
            }
            return JSON.stringify(error);
        });
        return {errors, textErrors};
    };
