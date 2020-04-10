import React, {Component} from "react";
import "./DataForm.css";
import {Table} from "react-bootstrap";

export class DataForm extends Component {
    constructor(props) {
        super(props); //since we are extending class Table so we have to use super in order to override Component class constructor
        this.state = {datasets: []};
    }
    componentDidMount() {
        this.refreshList();
    }

    refreshList() {
        this.setState({
            datasets: [],
        });
    }

    render() {
        return (
            <Table className="container mt-4" striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Dataset #</th>
                        <th>Dose</th>
                        <th>N</th>
                        <th>Mean</th>
                        <th>St. Dev.</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </Table>
        );
    }
}

export default DataForm;
