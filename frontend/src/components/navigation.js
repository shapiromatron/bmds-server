import React, {Component} from "react";
import {Route, NavLink} from "react-router-dom";
import {inject, observer} from "mobx-react";
import Main from "./Main/Main";
import Data from "./Data/Data";
import ReportOptions from "./ReportOptions/ReportOptions";
import Logic from "./Logic/logic";
import ModelParams from "./ModelParams/ModelParams";
import Output from "./Output/Output";
import StoreDebugger from "./StoreDebugger/StoreDebugger";
import "./app.css";

@inject("mainStore")
@observer
class Navigation extends Component {
    render() {
        const {excelUrl, wordUrl} = this.props.mainStore.config;
        return (
            <div className="app-nav">
                <nav className="navbar navbar-expand-md bg-primary navbar-dark">
                    <div className="collapse navbar-collapse" id="collapsibleNavbar">
                        <ul className="navbar-nav">
                            <li className=" nav-item active">
                                <NavLink className="nav-link" to="/">
                                    Main
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/data">
                                    Data
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/output">
                                    Output
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/debugger">
                                    Debugger
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className="dropdown btn-group pull-xs-right">
                        <button
                            className="btn btn-primary"
                            type="button"
                            id="dropdownMenuButton"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false">
                            <i className="fa fa-bars" aria-hidden="true"></i>
                        </button>
                        <div
                            className="dropdown-menu dropdown-menu-right"
                            aria-labelledby="dropdownMenuButton">
                            <a className="text-left dropdown-item" href={excelUrl}>
                                <i className="fa fa-file-excel-o"></i>&nbsp;Download dataset
                            </a>
                            <a className="text-left dropdown-item" href={wordUrl}>
                                <i className="fa fa-file-word-o"></i>&nbsp;Download report
                            </a>
                        </div>
                    </div>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#collapsibleNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </nav>

                <div className="content">
                    <Route exact path="/" component={Main} />
                    <Route path="/data" component={Data} />
                    <Route path="/reportoptions" component={ReportOptions} />
                    <Route path="/logic" component={Logic} />
                    <Route path="/modelparams" component={ModelParams} />
                    <Route path="/output" component={Output} />
                    <Route path="/debugger" component={StoreDebugger} />
                </div>
            </div>
        );
    }
}

export default Navigation;
