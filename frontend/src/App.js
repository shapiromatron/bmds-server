import React, {Component} from "react";
import {HashRouter} from "react-router-dom";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import {autorun} from "mobx";

import Navigation from "./components/Navigation";

@inject("mainStore")
@observer
class App extends Component {
    componentDidMount() {
        const config = JSON.parse(document.getElementById("config").textContent);
        this.props.mainStore.setConfig(config);
        this.props.mainStore.fetchSavedAnalysis();

        // update HTML document title
        autorun(() => {
            const {analysis_name, canEdit} = this.props.mainStore,
                verb = canEdit ? "Update Analysis" : "Analysis",
                name = analysis_name ? analysis_name : "";
            document.title = ["BMDS Online", verb, name].join(" | ");
        });
    }
    render() {
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
