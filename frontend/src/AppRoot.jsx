import {Provider} from "mobx-react";
import React from "react";
import {createRoot} from "react-dom/client";

import App from "@/App";
import rootStore from "@/stores/RootStore";
import history from "@/utils/localHistory";

const appStartup = el => {
    const root = createRoot(el);
    history.log();
    root.render(
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
};

export default appStartup;
