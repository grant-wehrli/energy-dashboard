import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const inferredBase =
  repositoryName && !repositoryName.endsWith(".github.io") ? `/${repositoryName}/` : "/";
const base = process.env.GITHUB_PAGES_BASE ?? inferredBase;

export default defineConfig({
  root: "github-pages",
  base,
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: {
    outDir: "../dist/github-pages",
    emptyOutDir: true,
  },
});
