import {autorun} from "mobx";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";
import {HashRouter} from "react-router-dom";

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
        const {analysis_name, canEdit} = this.props.mainStore,
            getHeader = () => {
                if (canEdit) {
                    return "Update BMDS analysis";
                }
                return analysis_name ? analysis_name : "BMDS analysis";
            };

        return this.props.mainStore.isUpdateComplete ? (
            <HashRouter>
                <h3 className="pt-1">{getHeader()}</h3>
                <Navigation />
            </HashRouter>
        ) : null;
    }
}
App.propTypes = {
    mainStore: PropTypes.object,
};
export default App;
