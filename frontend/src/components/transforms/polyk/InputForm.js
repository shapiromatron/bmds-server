import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

import Button from "../../common/Button";
import FloatInput from "../../common/FloatInput";
import TextAreaInput from "../../common/TextAreaInput";
import TextInput from "../../common/TextInput";

@inject("store")
@observer
class InputForm extends Component {
    render() {
        const {
            settings,
            updateSettings,
            error,
            submit,
            reset,
            loadExampleData,
            downloadExampleData,
        } = this.props.store;
        return (
            <form>
                <div className="row">
                    <div className="col-lg-4">
                        <TextInput
                            label="Dose units"
                            value={settings.dose_units}
                            onChange={value => updateSettings("dose_units", value)}
                        />
                        <p className="text-muted mb-0">
                            The dose metrics for the data being adjusted (e.g., ppm, mg/kg-d).
                        </p>
                    </div>
                    <div className="col-lg-4">
                        <FloatInput
                            label="Power"
                            value={settings.power}
                            onChange={value => updateSettings("power", value)}
                        />
                        <p className="text-muted mb-0">
                            The adjustment power. Defaults to 3, but can be adjusted given the
                            nature of the tumors being analyzed.
                        </p>
                    </div>
                    <div className="col-lg-4">
                        <FloatInput
                            label="Duration"
                            value={settings.duration}
                            onChange={value => updateSettings("duration", value)}
                        />
                        <p className="text-muted mb-0">
                            Study duration, in days. By default (if empty), the maximum reported day
                            in the dataset.
                        </p>
                    </div>
                    <div className="col-lg-4 offset-lg-2">
                        <TextAreaInput
                            rows={6}
                            label="Dataset"
                            value={settings.dataset}
                            onChange={value => updateSettings("dataset", value)}
                        />
                        <p className="text-muted mb-0">
                            Copy and paste data from a CSV, or directly from Excel.&nbsp;
                            <a
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    loadExampleData();
                                }}>
                                Load
                            </a>
                            &nbsp;or&nbsp;
                            <a
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    downloadExampleData();
                                }}>
                                download
                            </a>
                            &nbsp;example data.
                        </p>
                    </div>
                    <div className="col-lg-4 align-self-center">
                        <Button
                            className="btn btn-primary btn-block py-3"
                            onClick={submit}
                            text="Execute"
                        />
                        <Button
                            className="btn btn-secondary btn-block"
                            onClick={reset}
                            text="Reset"
                        />
                    </div>
                </div>
                {error ? (
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2">
                            <div className="alert alert-danger mt-3">
                                <p>
                                    <b>An error occurred.</b>
                                </p>
                                <pre>{JSON.stringify(error, null, 2)}</pre>
                            </div>
                        </div>
                    </div>
                ) : null}
            </form>
        );
    }
}
InputForm.propTypes = {
    store: PropTypes.object,
};

export default InputForm;
