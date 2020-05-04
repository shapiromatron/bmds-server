import React, {Component} from "react";

import UserInfo from "./UserInfo";
import ModelsCheckBoxList from "./ModelsCheckBoxList";
import DatasetName from "./DatasetName";
import OptionsFormList from "./OptionsFormList";

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
                        <ModelsCheckBoxList />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <OptionsFormList />
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;
