import React, {Component} from "react";

import AnalysisForm from "./AnalysisForm/AnalysisForm";
import ModelsCheckBoxList from "./ModelsForm/ModelsCheckBoxList";
import OptionsFormList from "./OptionsForm/OptionsFormList";
import PropTypes from "prop-types";

import {inject, observer} from "mobx-react";
import DatasetModelOptionList from "./DatasetModelOptionList/DatasetModelOptionList";
import AnalysisFormReadOnly from "./AnalysisForm/AnalysisFormReadOnly";
import {Toast} from "react-bootstrap";

@inject("mainStore")
@observer
class Main extends Component {
    render() {
        const {mainStore} = this.props;
        return (
            <div>
                {mainStore.isUpdateComplete ? (
                    <div>
                        <div>
                            <Toast
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                }}
                                className="bg-warning"
                                show={mainStore.showToast}
                                onClose={() => mainStore.closeToast()}>
                                <Toast.Header className="bg-warning">
                                    <strong className="mr-auto">{mainStore.toastStatus}</strong>
                                </Toast.Header>
                                <Toast.Body>{mainStore.toastMessage}</Toast.Body>
                            </Toast>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 analysis">
                                <div className="mb-2">
                                    {mainStore.canEdit ? (
                                        <AnalysisForm />
                                    ) : (
                                        <AnalysisFormReadOnly />
                                    )}
                                </div>
                                <div>
                                    {mainStore.getDatasetLength ? <DatasetModelOptionList /> : null}
                                </div>
                            </div>
                            <div className="col-lg-8">
                                <div>
                                    <ModelsCheckBoxList />
                                </div>
                                <div>
                                    <OptionsFormList />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}
Main.propTypes = {
    mainStore: PropTypes.object,
    isUpdateComplete: PropTypes.bool,
};
export default Main;
