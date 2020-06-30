import React, {Component} from "react";
import {HashRouter} from "react-router-dom";
import Navigation from "./components/navigation";
import StoreDebugger from "./components/StoreDebugger/StoreDebugger";
import {inject, observer} from "mobx-react";

@inject("mainStore")
@observer
class App extends Component {
    render() {
        const config = JSON.parse(document.getElementById("config").textContent);
        this.props.mainStore.setConfig(config);
        this.props.mainStore.fetchSavedAnalysis();
        return (
            <HashRouter className="app">
                <div>
                    <Navigation />
                    <StoreDebugger />
                </div>
            </HashRouter>
        );
    }
}

export default App;
