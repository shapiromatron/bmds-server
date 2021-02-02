import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import {Modal} from "react-bootstrap";

@inject("dataStore")
@observer
class CopyTableModal extends Component {
    render() {
        const {dataStore} = this.props;
        return (
            <Modal show={dataStore.showModal} onHide={() => dataStore.toggleDatasetModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>Save Dataset</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="text-center text-danger">
                        {dataStore.modalError ? dataStore.modalError : null}
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlTextarea1">Dataset</label>
                        <textarea
                            className="form-control"
                            id="exampleFormControlTextarea1"
                            rows="8"
                            onChange={e =>
                                dataStore.changeDatasetFromModal(e.target.value)
                            }></textarea>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button
                        className="btn btn-info"
                        onClick={() => dataStore.validateModalDataset()}>
                        Validate Dataset
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={() => dataStore.saveDatasetFromModal()}
                        disabled={!dataStore.isModalDataValidated}>
                        Save changes
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={() => dataStore.toggleDatasetModal()}>
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}
CopyTableModal.propTypes = {
    dataStore: PropTypes.object,
    toggleDatasetModal: PropTypes.func,
    modalError: PropTypes.string,
    isModalDataValidated: PropTypes.func,
    saveDatasetFromModal: PropTypes.func,
};
export default CopyTableModal;
