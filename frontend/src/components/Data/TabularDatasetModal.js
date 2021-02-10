import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import {Modal} from "react-bootstrap";

@inject("dataStore")
@observer
class TabularDatasetModal extends Component {
    render() {
        const {dataStore} = this.props;
        return (
            <Modal show={dataStore.showModal} onHide={dataStore.toggleDatasetModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Paste from Excel</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="form-group">
                        {dataStore.modalError ? (
                            <div className="alert alert-warning mb-2" role="alert">
                                {dataStore.modalError}
                            </div>
                        ) : null}

                        <textarea
                            className="form-control"
                            rows="16"
                            onChange={e =>
                                dataStore.changeDatasetFromModal(e.target.value)
                            }></textarea>

                        <p className="text-muted">
                            Copy/paste data from Excel into the box below. Data must be all numeric
                            with no headers or descriptive columns.
                        </p>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={dataStore.toggleDatasetModal}>
                        Cancel
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={dataStore.updateDatasetFromModal}
                        disabled={!dataStore.tabularModalDataValidated}>
                        <i className="fa fa-fw fa-save mr-1"></i>
                        Load
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}
TabularDatasetModal.propTypes = {
    dataStore: PropTypes.object,
};
export default TabularDatasetModal;
