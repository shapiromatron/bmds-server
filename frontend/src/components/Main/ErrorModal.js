import React, {Component} from "react";
import {Modal, Button} from "react-bootstrap";

import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("mainStore")
@observer
class ErrorModal extends Component {
    render() {
        const {mainStore} = this.props;
        return (
            <Modal show={mainStore.errorModal}>
                <Modal.Body>
                    <div>{mainStore.errorMessage}</div>
                    <div>
                        <Button variant="primary" onClick={() => mainStore.hideModal()}>
                            Ok
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}
ErrorModal.propTypes = {
    mainStore: PropTypes.object,
    errorModal: PropTypes.bool,
    errorMessage: PropTypes.string,
    hideModal: PropTypes.func,
};
export default ErrorModal;
