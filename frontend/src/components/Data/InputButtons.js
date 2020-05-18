import React, {Component} from "react";

import {inject, observer} from "mobx-react";

@inject("store")
@observer
class InputButtons extends Component {
    render() {
        const {store} = this.props;
        return (
            <div className="col-sm-3 text-center buttonCol">
                <button
                    id="insertButton"
                    type="button"
                    className="btn btn-secondary btn-block"
                    onClick={() => store.toggleModal()}>
                    Insert New Dataset
                </button>
                <button id="importButton" type="button" className="btn btn-secondary btn-block">
                    Import Dataset
                </button>
            </div>
        );
    }
}

export default InputButtons;
