import React, {Component} from "react";

import InputFormList from "./InputFormList";
import InputButtons from "./InputButtons";
import "./Data.css";

import {inject, observer} from "mobx-react";
import DatasetScatterplot from "./DatasetScatterplot";

@inject("store")
@observer
class Data extends Component {
    render() {
        const {store} = this.props;
        return (
            <div className="container position-static">
                <div className="row">
                    <InputButtons />
                    {store.getDataLength ? <InputFormList /> : null}

                    {store.getDataLength ? <DatasetScatterplot /> : null}
                </div>
            </div>
        );
    }
}

export default Data;
