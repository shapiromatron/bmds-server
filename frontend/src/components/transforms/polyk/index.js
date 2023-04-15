import {Provider} from "mobx-react";
import React from "react";
import {createRoot} from "react-dom/client";

import App from "./App";
import Store from "./store";

const render = function(el, token) {
    const config = JSON.parse(document.getElementById("config").textContent),
        root = createRoot(el),
        store = new Store(config.token);
    root.render(
        <Provider store={store}>
            <App />
        </Provider>
    );
};

export default render;
