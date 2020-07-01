import React, {Component} from "react";
import {HashRouter} from "react-router-dom";
import Navigation from "./components/navigation";
import {inject, observer} from "mobx-react";

@inject("mainStore")
@observer
class App extends Component {
    render() {
        const config = JSON.parse(document.getElementById("config").textContent);
        this.props.mainStore.setConfig(config);
        this.props.mainStore.fetchSavedAnalysis();
        return (
            <HashRouter>
                <div>
                    <Navigation />
                </div>
            </HashRouter>
        );
    }
}

export default App;
