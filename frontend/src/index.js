import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/font-awesome/css/font-awesome.min.css";

import {Provider} from "mobx-react";
import store from "./stores/DataStore";

const Root = (
    <Provider store={store}>
        <App />
    </Provider>
);

const appStartup = function(el) {
    ReactDOM.render(Root, el);
};

window.app = {
    appStartup,
};
