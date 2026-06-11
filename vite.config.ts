import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command }) => ({
  plugins: [
    command === "build" && cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart({
      server: { entry: "./src/server.ts" },
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  server: {
    host: "0.0.0.0",
    open: true,
    port: 3000,
    strictPort: true,
  },
}));
