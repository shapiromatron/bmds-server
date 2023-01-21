import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "mobx-react";

import App from "./App";
import history from "./utils/localHistory";
import poly3 from "./poly3";
import rootStore from "./stores/RootStore";

const Root = (
    <Provider
        store={rootStore}
        dataStore={rootStore.dataStore}
        dataOptionStore={rootStore.dataOptionStore}
        mainStore={rootStore.mainStore}
        outputStore={rootStore.outputStore}
        optionsStore={rootStore.optionsStore}
        modelsStore={rootStore.modelsStore}
        logicStore={rootStore.logicStore}>
        <App />
    </Provider>
);

const appStartup = function(el) {
    history.log();
    ReactDOM.render(Root, el);
};

window.app = {
    appStartup,
    history,
    poly3,
};
