import React, {Component} from "react";
import {Modal, Button} from "react-bootstrap";

import {inject, observer} from "mobx-react";

@inject("DataStore")
@observer
class MainModal extends Component {
    constructor(props) {
        super(props);
    }

    hideModal() {
        this.props.DataStore.mainModal = !this.props.DataStore.mainModal;
    }

    render() {
        let errorMessage = this.props.DataStore.modalMessage;
        return (
            <div>
                <Modal show={this.props.DataStore.mainModal}>
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
