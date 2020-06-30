import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/font-awesome/css/font-awesome.min.css";

import {Provider} from "mobx-react";
import rootStore from "./stores/RootStore";

const Root = (
    <Provider
        store={rootStore}
        dataStore={rootStore.dataStore}
        mainStore={rootStore.mainStore}
        outputStore={rootStore.outputStore}>
        <App />
    </Provider>
);

const appStartup = function(el) {
    ReactDOM.render(Root, el);
};

window.app = {
    appStartup,
};
