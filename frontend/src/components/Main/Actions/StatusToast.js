import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {Toast} from "react-bootstrap";
import PropTypes from "prop-types";

@inject("mainStore")
@observer
class StatusToast extends Component {
    render() {
        const {mainStore} = this.props;
        return (
            <Toast
                style={
                    mainStore.toastVisible
                        ? {
                              position: "absolute",
                              top: "1em",
                              right: "1em",
                              width: 400,
                              zIndex: 1000,
                          }
                        : {display: "none"}
                }
                show={mainStore.toastVisible}
                onClose={mainStore.closeToast}>
                <Toast.Header className="bg-danger text-white" closeButton={false}>
                    {mainStore.toastHeader}
                </Toast.Header>
                <Toast.Body className="bg-white">{mainStore.toastMessage}</Toast.Body>
            </Toast>
        );
    }
}
StatusToast.propTypes = {
    mainStore: PropTypes.object,
};
export default StatusToast;
