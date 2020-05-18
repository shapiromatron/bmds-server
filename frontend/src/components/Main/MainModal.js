import React, {Component} from "react";
import {Modal, Button} from "react-bootstrap";

import {inject, observer} from "mobx-react";

@inject("store")
@observer
class MainModal extends Component {
    hideModal() {
        this.props.store.mainModal = !this.props.store.mainModal;
    }
    render() {
        let errorMessage = this.props.store.modalMessage;
        return (
            <div>
                <Modal show={this.props.store.mainModal}>
                    <Modal.Body>
                        <div>{errorMessage}</div>
                        <div>
                            <Button variant="primary" onClick={() => this.hideModal()}>
                                Ok
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default MainModal;
