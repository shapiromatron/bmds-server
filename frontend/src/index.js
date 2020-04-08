
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "./index.css"

import {Provider} from 'mobx-react';
import DataStore from './stores/DataStore'

const Root=(
    <Provider DataStore={DataStore}>
    <App/>
    </Provider>
)
 
ReactDOM.render(Root, document.getElementById("root"));
