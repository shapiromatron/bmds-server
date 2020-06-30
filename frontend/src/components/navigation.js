import React, {Component} from "react";
import {Route, NavLink} from "react-router-dom";
import Main from "./Main/Main";
import Data from "./Data/Data";
import ReportOptions from "./ReportOptions/ReportOptions";
import Logic from "./Logic/logic";
import ModelParams from "./ModelParams/ModelParams";
import Output from "./Output/Output";

class Navigation extends Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg bg-primary navbar-dark">
                    <a className="navbar-brand" href="/">
                        BMDS 3.1.2
                    </a>
                    <div>
                        <ul className="navbar-nav">
                            <li className=" active">
                                <NavLink className="nav-link" to="/">
                                    Main
                                </NavLink>
                            </li>
                            <li className="">
                                <NavLink className="nav-link" to="/data">
                                    Data
                                </NavLink>
                            </li>
                            <li className="">
                                <NavLink className="nav-link" to="/reportoptions">
                                    Report Options
                                </NavLink>
                            </li>
                            <li className="">
                                <NavLink className="nav-link" to="/logic">
                                    Logic
                                </NavLink>
                            </li>
                            <li className="">
                                <NavLink className="nav-link" to="/modelparams">
                                    Model Params
                                </NavLink>
                            </li>
                            <li className="">
                                <NavLink className="nav-link" to="/output">
                                    Output
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>

                <div className="content">
                    <Route exact path="/" component={Main} />
                    <Route path="/data" component={Data} />
                    <Route path="/reportoptions" component={ReportOptions} />
                    <Route path="/logic" component={Logic} />
                    <Route path="/modelparams" component={ModelParams} />
                    <Route path="/output" component={Output} />
                </div>
            </div>
        );
    }
}

export default Navigation;
