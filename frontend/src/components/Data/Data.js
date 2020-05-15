import React, {Component} from "react";

import InputFormList from "./InputFormList";
import DataTable from "./DataTable";
import InputButtons from "./InputButtons";
import DataModal from "./DataModal";

import {inject, observer} from "mobx-react";

@inject("store")
@observer
class Data extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                <div className="row buttonRow">
                    <InputButtons />
                </div>

                <div>
                    <div>
                        {this.props.store.inputForm.model_type ? <InputFormList /> : null}
                    </div>
                    <div>{this.props.store.getDataLength > 0 ? <DataTable /> : null}</div>
                </div>
                <div>{this.props.store.modal ? <DataModal /> : null}</div>
            </div>
        );
    }
}

export default Data;
