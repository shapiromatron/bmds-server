import $ from "$";
import _ from "lodash";

const KEY = "bmds.data";

class RunTracker {
    constructor() {
        this.data = this.load();
        this.add();
    }
    load() {
        try {
            return JSON.parse(window.localStorage.getItem(KEY)) || {};
        } catch (error) {
            return {};
        }
    }
    save() {
        window.localStorage.setItem(KEY, JSON.stringify(this.data));
    }
    add() {
        const {protocol, host, pathname} = window.location;
        if (pathname !== "/") {
            const url = `${protocol}//${host}${pathname}`;
            this.data[url] = Date.now();
            this.save();
        }
    }
    show() {
        const messages = [
                "<h4>BMDS Run Tracker</h4>",
                "<p>Saves recently executed BMDS sessions in case you forgot the URL. Note that these are only only saved in your browser cache, so long-term storage is not guaranteed in any way, but could be useful in a pinch. These data are not saved or backed up on the server in any way.</p>",
            ],
            ul = $("<ul>");

        _.chain(this.data)
            .map((lastAccess, href) => {
                return {href, lastAccess};
            })
            .orderBy(["lastAccess"], ["desc"])
            .forEach(row =>
                ul.append(
                    `<li>[${new Date(row.lastAccess).toLocaleString()}]: <a target="_blank" href="${
                        row.href
                    }">${row.href}</a></li>`
                )
            )
            .value();

        $("#main-content").prepend(
            $("<div class='alert alert-info'>")
                .append(messages)
                .append(ul)
        );
    }
    clear() {
        window.localStorage.clear(KEY);
    }
}

const tracker = new RunTracker();

export default tracker;
