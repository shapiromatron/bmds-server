import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {Toast} from "react-bootstrap";
import PropTypes from "prop-types";

@inject("mainStore")
@observer
class DownloadToast extends Component {
    render() {
        const {mainStore} = this.props;
        return (
            <Toast
                style={{
                    position: "absolute",
                    top: 0,
                    right: 100,
                    width: 300,
                    zIndex: 1000,
                }}
                show={mainStore.showToast}
                onClose={mainStore.closeToast}>
                <Toast.Header className="bg-primary text-white" closeButton={false}>
                    {mainStore.toastHeader}
                </Toast.Header>
                <Toast.Body>{mainStore.toastMessage}</Toast.Body>
            </Toast>
        );
    }
}
DownloadToast.propTypes = {
    mainStore: PropTypes.object,
};
export default DownloadToast;
