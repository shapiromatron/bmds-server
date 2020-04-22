import React, {Component} from "react";

import UserInfo from "./UserInfo";
import ModelType from "./ModelType";
import DatasetName from "./DatasetName";
import OptionsForm from "./OptionsForm";
import "./Main.css";

class Main extends Component {
    render() {
        return (
            <div className="container ">
                <div className="row">
                    <div className="col col-sm-6">
                        <UserInfo />
                    </div>

                    <div className="col col-sm-5">
                        <DatasetName />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <ModelType />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <OptionsForm />
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;
