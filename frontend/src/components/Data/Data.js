import React, {Component} from "react";

import DataForm from "./DataForm";
import DataTable from "./DataTable";
import InputButtons from "./InputButtons";
import Modaldata from "./Modaldata";

import "./Data.css";

import {inject, observer} from "mobx-react";

@inject("DataStore")
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
                    <div>{this.props.DataStore.showForm ? <DataForm /> : null}</div>
                    <div>{this.props.DataStore.getDataLength > 0 ? <DataTable /> : null}</div>
                </div>
                <div>{this.props.DataStore.modal ? <Modaldata /> : null}</div>
            </div>
        );
    }
}

export default Data;
