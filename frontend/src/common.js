import React from "react";

const simulateClick = function(el) {
        // https://gomakethings.com/how-to-simulate-a-click-event-with-javascript/
        const evt = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
        });
        !el.dispatchEvent(evt);
    },
    readOnlyCheckbox = bool => {
        return <i className={bool ? "fa fa-check-square-o" : "fa fa-square-o"}></i>;
    };

export {simulateClick, readOnlyCheckbox};
