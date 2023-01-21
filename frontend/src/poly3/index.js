import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "mobx-react";

import Store from "./store";
import App from "./App";

const render = function(el, token) {
    const store = new Store(token);
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        el
    );
};

export default render;
