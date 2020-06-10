import React, {Component} from "react";
import {Modal, Button} from "react-bootstrap";

import {inject, observer} from "mobx-react";

@inject("mainStore")
@observer
class MainModal extends Component {
    render() {
        const {mainStore} = this.props,
            hideModal = () => {
                mainStore.errorModal = !mainStore.errorModal;
            },
            errorMessage = mainStore.errorMessage;
        return (
            <div>
                <Modal show={mainStore.errorModal}>
                    <Modal.Body>
                        <div>{errorMessage}</div>
                        <div>
                            <Button variant="primary" onClick={() => hideModal()}>
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
