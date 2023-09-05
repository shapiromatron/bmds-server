import react from "@vitejs/plugin-react";
import {resolve} from "path";
import {defineConfig} from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {"@": resolve(__dirname, "./src")},
    },
    server: {
        strictPort: true,
        origin: "http://localhost:5173",
    },
    base: "/static/frontend/",
    build: {
        manifest: true,
        outDir: resolve(__dirname, "..", "bmds_server/static/bundles/"),
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, "src/index.js"),
            },
        },
    },
    esbuild: {
        loader: "jsx",
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                ".js": "jsx",
            },
        },
    },
});
