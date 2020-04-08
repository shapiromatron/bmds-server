import React, { Component } from "react";
import { DataModal } from './DataModal';
import { DataForm } from './DataForm';
import { Container, Table, Row, Col } from 'react-bootstrap';
import { Modal, Button, Form, FormControl } from 'react-bootstrap'
import './Data.css'

import {inject, observer} from 'mobx-react';

@inject('DataStore')
@observer
class Data extends Component {


  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      showForm: false,
      rows:[{
        dose:'',
        n:'',
        mean:'',
        stdev:''
      }]
    }
  }


  handleSubmit = (event) => {
    event.preventDefault();
    const modelType= event.target.modelType.value
    this.setState({
      modelType:modelType
    })
    console.log(modelType);
   
  
  }
  
  handleChange = idx => e => {
    const { name, value } = e.target;
    const rows = [...this.state.rows];
   
    rows[idx] = {
      [name]: value
    };
    this.setState({
      rows
    });
  
  };
  handleDataSubmit = (e) => {
    e.preventDefault();

    const dose = this.dose.value;
    const n = this.n.value;
    const mean = this.mean.value;
    const stdev = this.stdev.value;

    var datasets = {'dose':dose, 'n':n, 'mean':mean, 'stdev':stdev}
    
    this.props.DataStore.addDataSets(datasets);
   
   
    
  }

  handleAddRow = () => {
    const item = {
      dose: "",
      n: "",
      mean:"",
      stdev:""
    };
    this.setState({
      rows: [...this.state.rows, item]
    });
  };

  handleRemoveSpecificRow = (idx) => () => {
    const rows = [...this.state.rows]
    rows.splice(idx, 1)
    this.setState({ rows })
  }
  

  




  render() {
    let showModal = () => this.setState({ showModal: false });
    const { dose, n, mean,stdev } = this;
    const {DataStore} = this.props;

    return (
      <div className="container-fluid">
        <div className="row buttonRow">
          <div className="col-sm-2 text-center buttonCol">
            <button id="insertButton" type="button" className="btn btn-secondary btn-block" onClick={() => this.setState({ showModal: true })} >Insert New Dataset</button>
            <button id="importButton" type="button" className="btn btn-secondary btn-block">Import Dataset</button>
          </div>
        </div>
        <div><h2>you have {DataStore.dataSetCount} data.</h2></div>
      <div>
      </div>
        {
          this.state.showForm ?
          <div className="container-fluid data-table">
          <div className="row clearfix">
            <div className="col-md-6 column">
            
              <table
                className="table table-bordered table-hover"
                id="tab_logic"
              >
                <thead>
                  <tr>
                    <th className="text-center"> # </th>
                    <th className="text-center"> Dose </th>
                    <th className="text-center"> N </th>
                    <th className="text-center"> Mean </th>
                    <th className="text-center"> St. Dev. </th>

                    <th />
                  </tr>
                </thead>
                <tbody>
                  
                  {this.state.rows.map((item, idx) => (
                    <tr id="addr0" key={idx}>
                      <td>{idx}</td>
                      <td>
                        <input
                          type="text"
                          name="dose"
                          ref={input=> this.dose=input}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="n"
                          ref={input=> this.n=input}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="mean"
                          ref={input=> this.mean=input}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="stdev"
                          ref={input=> this.stdev=input}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={this.handleRemoveSpecificRow(idx)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                
                </tbody>
              </table>
            
              <button onClick={this.handleAddRow} className="btn btn-info">
                Add Row
              </button>
              <button
              onClick={e => this.handleDataSubmit(e)}
                className="btn btn-primary float-right">
                Submit
              </button>
            </div>
          </div>
        </div>

            : null
  }

        {/* <DataModal show={this.state.showModal} onHide={showModal} /> */ }
<div >
  <Modal show={this.state.showModal} onHide={showModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter"> Add Dataset </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form onSubmit={this.handleSubmit}>
        <Form.Group>
          <Form.Label>Select Model Type</Form.Label>
          <Form.Control as="select" name="modelType" >
            <option value="CS">Continuous - summarized</option>
            <option value="CI">Continuous - individual</option>
            <option value="D">Dichotomous</option>
            <option value="N">Nested</option>
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Button style={{ marginRight: '20px' }} variant="primary" type="submit" onClick={() => this.setState({ showForm: true, showModal: false })}>Create Dataset</Button>
          <Button variant="primary" onClick={() => this.setState({ showModal: false })} >Close</Button>
        </Form.Group>
      </Form>
    </Modal.Body>
  </Modal>

</div>
      </div>
    );
  }
}

export default Data;