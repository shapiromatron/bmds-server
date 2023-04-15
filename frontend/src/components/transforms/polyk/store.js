import {makeAutoObservable} from "mobx";

import {getHeaders} from "../../../common";
import {exampleData} from "./data";

class Store {
    constructor(token) {
        makeAutoObservable(this, {rootStore: false, token: false}, {autoBind: true});
        this.token = token;
    }

    settings = {
        dataset: "",
        dose_units: "ppm",
        power: 3,
        duration: 730,
    };
    error = null;
    errorObject = null;
    outputs = null;

    updateSettings(key, value) {
        this.settings[key] = value;
    }

    updateOutput(data) {
        this.outputs = data;
    }
    updateError(data) {
        this.error = true;
        console.error(data);
        try {
            this.error = JSON.parse(data);
        } catch (err) {
            console.error(err);
        }
    }

    async submit() {
        const url = "/api/v1/polyk/";
        this.error = null;
        await fetch(url, {
            method: "POST",
            mode: "cors",
            headers: getHeaders(this.token),
            body: JSON.stringify(this.settings),
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(this.updateOutput);
                } else {
                    response
                        .json()
                        .then(this.updateError)
                        .catch(this.updateError);
                }
            })
            .catch(this.updateError);
    }

    loadExampleData() {
        this.updateSettings("dataset", exampleData);
    }
}

export default Store;
