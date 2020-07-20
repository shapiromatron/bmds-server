import {observable, action, computed} from "mobx";
import rootStore from "./RootStore";

class NavStore {

   @observable config =rootStore.mainStore.config;

    @action
    async downloadExcelReport() {
        const excelUrl = this.config.editSettings.excelUrl;
        await fetch(excelUrl, {
            method: "GET",
            mode: "cors",
        })
            .then(Response => console.log(Response.status))
            .catch(error => {
                console.error("error", error);
            });
    }

    @action
    async downloadWordReport() {
        const wordUrl = this.config.editSettings.wordUrl;
        await fetch(wordUrl, {
            method: "GET",
            mode: "cors",
        })
            .then(Response => console.log(Response.status))
            .catch(error => {
                console.error("error", error);
            });
    }

}

const navStore = new NavStore();
export default navStore;
