import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import history from "./utils/localHistory";
import {Provider} from "mobx-react";
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
    ReactDOM.render(Root, el);
    history.log();
};

window.app = {
    appStartup,
    history,
};
