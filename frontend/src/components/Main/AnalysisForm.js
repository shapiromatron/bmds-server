import React, {Component} from "react";
import {Button, Form} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import AnalysisFormReadOnly from "./AnalysisFormReadOnly";

@inject("mainStore")
@observer
class AnalysisForm extends Component {
    render() {
        const {mainStore} = this.props,
            handleSubmit = e => {
                e.preventDefault();
                mainStore.saveAnalysis();
            },
            handleChange = e => {
                mainStore.addanalysisForm(e.target.name, e.target.value);
            },
            isEditSettings = mainStore.getEditSettings();

        return (
            <div>
                {isEditSettings ? (
                    <Form onSubmit={handleSubmit} className="main-form">
                        <Form.Group>
                            <Form.Label>Analysis Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="analysis_name"
                                value={mainStore.analysisForm.analysis_name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Analysis Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows="3"
                                name="analysis_description"
                                value={mainStore.analysisForm.analysis_description}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Select Model Type</Form.Label>
                            <Form.Control
                                as="select"
                                name="dataset_type"
                                onChange={handleChange}
                                value={mainStore.analysisForm.dataset_type}>
                                {mainStore.modelTypes.map((item, i) => {
                                    return [
                                        <option key={i} value={item.value}>
                                            {item.name}
                                        </option>,
                                    ];
                                })}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button>Load Analysis</Button>
                            <Button type="submit">Save Analysis</Button>
                            <Button
                                disabled={!mainStore.isReadyToExecute}
                                onClick={() => mainStore.executeAnalysis()}>
                                Run Analysis
                            </Button>
                        </Form.Group>

                        {mainStore.isExecuting ? <p>Executing... please wait....</p> : null}
                    </Form>
                ) : (
                    <AnalysisFormReadOnly />
                )}
            </div>
        );
    }
}

export default AnalysisForm;
