import {Provider} from "mobx-react";
import React from "react";
import {createRoot} from 'react-dom/client';

import App from "@/App";
import {renderPlotlyFigure} from "@/components/common/PlotlyFigure";
import polyk from "@/components/transforms/polyk";
import rootStore from "@/stores/RootStore";
import history from "@/utils/localHistory";

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
    const root = createRoot(el);
    history.log();
    root.render(Root);
};

window.app = {
    appStartup,
    history,
    renderPlotlyFigure,
    polyk,
};
