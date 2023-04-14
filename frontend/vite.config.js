import react from "@vitejs/plugin-react";
import {resolve} from "path";
import {defineConfig} from "vite";
import checker from "vite-plugin-checker";

export default defineConfig({
    plugins: [
        react({
            babel: {
                babelrc: true,
            },
        }),
        checker({
            eslint: {lintCommand: "eslint --cache --ext .js ."},
            stylelint: {lintCommand: "stylelint --cache **/*.css"},
            enableBuild: true,
            terminal: true,
            overlay: true,
        }),
    ],
    server: {
        port: 8199,
        open: false,
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
    base: "/static/bundles/",
    build: {
        manifest: true,
        outDir: resolve(__dirname, "..", "bmds_server/static/bundles/"),
        emptyOutDir: true,
        rollupOptions: {
            input: [resolve(__dirname, "./src/main.jsx")],
        },
    },
});
