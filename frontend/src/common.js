const simulateClick = function(el) {
    // https://gomakethings.com/how-to-simulate-a-click-event-with-javascript/
    const evt = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
    });
    !el.dispatchEvent(evt);
};

export {simulateClick};
