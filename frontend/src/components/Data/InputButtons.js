import React, {Component} from "react";

import {inject, observer} from "mobx-react";

@inject("DataStore")
@observer
class InputButtons extends Component {
    constructor(props) {
        super(props);
    }

    showModal() {
        this.props.DataStore.toggleModal();
    }
    render() {
        return (
            <div className="col-sm-3 text-center buttonCol">
                <button
                    id="insertButton"
                    type="button"
                    className="btn btn-secondary btn-block"
                    onClick={() => this.showModal()}>
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
