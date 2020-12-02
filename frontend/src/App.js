import React, {Component} from "react";
import {HashRouter} from "react-router-dom";
import Navigation from "./components/Navigation";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("mainStore")
@observer
class App extends Component {
    render() {
        const config = JSON.parse(document.getElementById("config").textContent);
        this.props.mainStore.setConfig(config);
        this.props.mainStore.fetchSavedAnalysis();
        return (
            <div>
                {this.props.mainStore.isUpdateComplete ? (
                    <HashRouter>
                        <Navigation />
                    </HashRouter>
                ) : null}
            </div>
        );
    }
}
App.propTypes = {
    mainStore: PropTypes.object,
    setConfig: PropTypes.func,
    fetchSavedAnalysis: PropTypes.func,
    isUpdateComplete: PropTypes.func,
};
export default App;
