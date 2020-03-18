import React from "react";
import ReactDOM from "react-dom";

const listStartup = function(el) {
    ReactDOM.render(<h1>Hello world webpack!</h1>, el);
};

window.app = {
    listStartup,
};
