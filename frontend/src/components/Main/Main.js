import React, {Component} from "react";

import UserInfo from "./UserInfo";
import ModelsCheckBoxList from "./ModelsCheckBoxList";
import DatasetName from "./DatasetName";
import OptionsFormList from "./OptionsFormList";
import "./main.css";

import {inject, observer} from "mobx-react";

@inject("DataStore")
@observer
class Main extends Component {
    render() {
        return (
            <div className="container ">
                <div className="row">
                    <div className="col col-sm-5">
                        <UserInfo />
                    </div>
                    {this.props.DataStore.getDataLength > 0 ? (
                        <div className="col col-sm-5">
                            <DatasetName />
                        </div>
                    ) : null}
                </div>
                {this.props.DataStore.modelType ? (
                    <div className="row">
                        <div className="col">
                            <ModelsCheckBoxList />
                        </div>
                    </div>
                ) : null}
                {this.props.DataStore.modelType ? (
                    <div className="row">
                        <div className="col">
                            <OptionsFormList />
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default Main;
