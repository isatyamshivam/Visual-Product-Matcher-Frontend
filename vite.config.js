import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig(function (_a) {
    var _b;
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), "");
    return {
        plugins: [react()],
        server: {
            port: 3000,
            open: true,
        },
        define: {
            __API_URL__: JSON.stringify((_b = env.VITE_API_URL) !== null && _b !== void 0 ? _b : "http://localhost:8000"),
        },
    };
});
