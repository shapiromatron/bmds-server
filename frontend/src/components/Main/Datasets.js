import React from "react";
import {Form} from "react-bootstrap";

const Datasets = props => {
    return (
        <tbody>
            {props.datasets.map((item, index) => {
                return [
                    <tr key={index}>
                        <td>
                            <input
                                type="checkbox"
                                name="isIncluded"
                                checked={props.enabledDatasets.includes(item)}
                                onChange={e => props.toggleDatasets(e, item.dataset_id)}
                            />
                        </td>
                        <td>{item.dataset_name}</td>
                        {props.dataset_type == "C" ? (
                            <td>
                                {" "}
                                <Form.Control
                                    as="select"
                                    name="adverse_direction"
                                    onChange={e => props.onChange(e, item.dataset_id)}>
                                    {props.adverseList.map((item, i) => {
                                        return [
                                            <option key={i} value={item.value}>
                                                {item.name}
                                            </option>,
                                        ];
                                    })}
                                </Form.Control>
                            </td>
                        ) : null}
                        {props.dataset_type == "DM" ? (
                            <td>
                                {" "}
                                <Form.Control
                                    as="select"
                                    name="degree"
                                    onChange={e => props.onChange(e, item.dataset_id)}>
                                    {props.degree.map((item, i) => {
                                        return [
                                            <option key={i} value={item.value}>
                                                {item.name}
                                            </option>,
                                        ];
                                    })}
                                </Form.Control>
                            </td>
                        ) : null}
                        {props.dataset_type == "DM" ? (
                            <td>
                                <Form.Control
                                    as="select"
                                    name="background"
                                    onChange={e => props.onChange(e, item.dataset_id)}>
                                    {props.background.map((item, i) => {
                                        return [
                                            <option key={i} value={item.value}>
                                                {item.name}
                                            </option>,
                                        ];
                                    })}
                                </Form.Control>
                            </td>
                        ) : null}
                    </tr>,
                ];
            })}
        </tbody>
    );
};
export default Datasets;
