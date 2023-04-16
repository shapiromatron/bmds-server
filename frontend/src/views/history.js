import history from "@/utils/localHistory";

export default function() {
    console.error("a");
    const el = document.getElementById("main");
    history.render(el);
}
