import React, {Component} from "react";
import {Button, Form, FormControl} from "react-bootstrap";
import {Container, Row, Col} from "react-bootstrap";
import "./Main.css";

import * as ReactBootstrap from "react-bootstrap";

class Main extends Component {
    render() {
        return (
            <Container className="main-container" fluid>
                <Row className="main-row">
                    <Col className="main-form" xs={4}>
                        <Form>
                            <Form.Group>
                                <Form.Label>Analysis Name</Form.Label>
                                <Form.Control type="text" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Analysis Description</Form.Label>
                                <Form.Control as="textarea" rows="3" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Select Model Type</Form.Label>
                                <Form.Control as="select">
                                    <option>Continuous</option>
                                    <option>Dichotomous</option>
                                    <option>Dichotomous-Multi-tumor(MS_Combo)</option>
                                    <option>Dichotomous-Nested</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Button>Load Analysis</Button>
                                <Button>Save Analysis</Button>
                                <Button>Run Analysis</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col className="main-table" xs={7}>
                        <ReactBootstrap.Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th colSpan="2">MLE</th>
                                    <th colSpan="3">Alternatives</th>
                                </tr>

                                <tr>
                                    <th></th>
                                    <th>Frequentist Restricted</th>
                                    <th>Frequentist Unrestricted</th>
                                    <th>Bayesian</th>
                                    <th colSpan="2">Bayesian Model Average</th>
                                </tr>

                                <tr>
                                    <th>Model Name</th>
                                    <th>Enable</th>
                                    <th>Enable</th>
                                    <th>Enable</th>
                                    <th>Enable</th>
                                    <th>Prior Weights</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Exponential</td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Hill</td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Linear</td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Polynomial</td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Power</td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>Total Weights</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </ReactBootstrap.Table>
                    </Col>
                </Row>
                <Row>
                    <Col xs={4}>
                        <ReactBootstrap.Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Enable</th>
                                    <th>DataSets</th>
                                    <th>Adverse Direction</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>DataSet Name1</td>
                                    <td>
                                        {" "}
                                        <Form.Control as="select">
                                            <option>autmatic</option>
                                            <option>up</option>
                                            <option>down</option>
                                        </Form.Control>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </ReactBootstrap.Table>
                    </Col>
                    <Col>
                        <ReactBootstrap.Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Option Set #</th>
                                    <th>BMR Type</th>
                                    <th>BMRF</th>
                                    <th>Tail Probability</th>
                                    <th>Confidence Level</th>
                                    <th>Distribution</th>
                                    <th>Variance</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>
                                        <Form.Control as="select">
                                            <option>Std. Dev.</option>
                                            <option>Rel. Dev.</option>
                                            <option>Abs. Dev.</option>
                                            <option>Point</option>
                                            <option>Hybrid- extra risk</option>
                                        </Form.Control>
                                    </td>
                                    <td>
                                        <input type="text" />
                                    </td>
                                    <td>0.01</td>
                                    <td>0.95</td>
                                    <td>
                                        <Form.Control as="select">
                                            <option>normal</option>
                                            <option>Log-normal</option>
                                        </Form.Control>
                                    </td>
                                    <td>
                                        <Form.Control as="select">
                                            <option>Constant</option>
                                            <option>Non-constant</option>
                                        </Form.Control>
                                    </td>
                                </tr>
                            </tbody>
                        </ReactBootstrap.Table>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Main;
