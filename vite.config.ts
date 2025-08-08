import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { writeFileSync } from "fs";

const outDir = "docs";
const isDev = process.env.NODE_ENV === "development";

function noJekyllPlugin() {
  return {
    name: "vite-plugin-nojekyll",
    closeBundle() {
      const filePath = resolve(outDir, ".nojekyll");
      writeFileSync(filePath, "");
      console.log("✅ .nojekyll added to build output");
    },
  };
}

export default defineConfig({
  plugins: [react(), noJekyllPlugin()],
  base: isDev ? undefined : "https://solidsnail.github.io/llmini.js/",
  optimizeDeps: {
    include: ["kokoro-js"],
  },
  build: {
    outDir,
    rollupOptions: {
      external: [],
    },
  },
  worker: {
    format: "es",
  },
});
