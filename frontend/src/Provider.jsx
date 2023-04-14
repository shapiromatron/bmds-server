import { Provider } from "mobx-react";
import React from "react";
import ReactDOM from "react-dom";

import App from "@/App";
import rootStore from "@/stores/RootStore";
import history from "@/utils/localHistory";

const appStartup = function (el) {
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
    history.log();
    ReactDOM.render(Root, el);
};

export default appStartup;
