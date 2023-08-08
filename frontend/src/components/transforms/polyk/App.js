import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

import AboutModal from "./AboutModal";
import InputForm from "./InputForm";
import OutputTabs from "./OutputTabs";

@inject("store")
@observer
class App extends Component {
    render() {
        const {outputs, showAboutModal, setAboutModal} = this.props.store;
        return (
            <div className="container py-3">
                <div className="d-flex justify-content-between">
                    <h2>Poly K Adjustment</h2>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setAboutModal(true)}>
                        About
                    </button>
                </div>
                <>{showAboutModal ? <AboutModal store={this.props.store} /> : null}</>
                <p className="text-muted col-lg-8">
                    Correct for treatment-related differences in survival across dose groups in
                    standard 2-year cancer bioassays. For more details, review the software&nbsp;
                    <a href="#" onClick={() => setAboutModal(true)}>
                        description
                    </a>
                    .
                </p>
                <h3>Settings</h3>
                <InputForm />
                {outputs ? (
                    <>
                        <h3 className="pt-3">Results</h3>
                        <OutputTabs />
                    </>
                ) : null}
            </div>
        );
    }
}
App.propTypes = {
    store: PropTypes.object,
};
export default App;
