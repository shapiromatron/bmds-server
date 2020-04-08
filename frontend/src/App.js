import React, {Component} from "react";
import {HashRouter} from "react-router-dom";
import Navigation from "./components/navigation";
import "./index.css";

import {Button, Navbar, Nav, Form, FormControl} from "react-bootstrap";

class App extends Component {
    render() {
        return (
            <HashRouter>
                <div>
                    <Navbar bg="primary" variant="dark">
                        <h2 className="text-center" href="/">
                            BMDS 3.1.2
                        </h2>
                    </Navbar>
                    <Navigation />
                </div>
            </HashRouter>
        );
    }
}

export default App;
