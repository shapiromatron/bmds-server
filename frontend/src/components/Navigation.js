import React, {Component} from "react";
import {Route, NavLink} from "react-router-dom";
import {inject, observer} from "mobx-react";
import Main from "./Main/Main";
import DataTab from "./Data/DataTab";
import LogicRoot from "./Logic/LogicRoot";
import Output from "./Output/Output";
import PropTypes from "prop-types";

import Actions from "./Main/Actions/Actions";
import ShareActions from "./Main/Actions/ShareActions";
import DownloadToast from "./Main/Actions/DownloadToast";
import WordReportOptionsModal from "./Main/Actions/WordReportOptionsModal";

@inject("mainStore")
@observer
class Navigation extends Component {
    render() {
        const {mainStore} = this.props;
        return (
            <>
                <ul className="nav nav-tabs d-flex mt-3">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/" exact={true}>
                            Settings
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/data">
                            Data
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink id="navlink-output" className="nav-link" to="/output">
                            Output
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/logic">
                            Logic
                        </NavLink>
                    </li>
                    {mainStore.canEdit ? (
                        <li className="nav-item ml-auto mr-1">
                            <ShareActions />
                        </li>
                    ) : null}
                    <li
                        className={mainStore.canEdit ? "nav-item" : "nav-item ml-auto"}
                        style={{position: "relative"}}>
                        <Actions />
                        <DownloadToast />
                        <WordReportOptionsModal />
                    </li>
                </ul>
                <div className="content mt-2">
                    <Route exact path="/" component={Main} />
                    <Route path="/data" component={DataTab} />
                    <Route path="/logic" component={LogicRoot} />
                    <Route path="/output" component={Output} />
                </div>
                <div id="payload" style={{color: "white", height: "1px", overflow: "hidden"}}>
                    {JSON.stringify(mainStore.getPayload, undefined, 2)}
                </div>
            </>
        );
    }
}
Navigation.propTypes = {
    mainStore: PropTypes.object,
    wordUrl: PropTypes.string,
    ExcelUrl: PropTypes.string,
    config: PropTypes.object,
};
export default Navigation;
