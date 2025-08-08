import { exec } from "child_process";
import fs from "fs/promises";

const main = async () => {
  const tsc = exec("tsc --p tsconfig.lib.json --outDir ./dist");
  tsc.on("close", async () => {
    const packageJsonStr = await fs.readFile("package.json", "utf-8");
    const packageJson = JSON.parse(packageJsonStr);
    await fs.writeFile(
      "dist/package.json",
      JSON.stringify(
        {
          name: "llmini.js",
          type: "module",
          private: false,
          version: packageJson.version,
          dependencies: {
            "@huggingface/transformers": "^3.7.1",
            "kokoro-js": "^1.2.1",
            outetts: "^0.2.0",
            wavefile: "^11.0.0",
            "lucide-react": "^0.534.0",
            marker: "^0.1.2",
            "marked-highlight": "^2.2.2",
            "highlight.js": "^11.11.1",
            dompurify: "^3.2.6",
          },
          files: ["categories", "themes", "ui", "constants"],
          exports: {
            "./categories/*": {
              import: "./categories/*/index.js",
              types: "./categories/*/index.d.ts",
            },
            "./themes/*.css": "./themes/*.css",
            "./ui": {
              import: "./ui/index.js",
              types: "./ui/index.d.ts",
            },
            "./constants": {
              import: "./constants.js",
              types: "./constants.d.ts",
            },
          },
        },
        null,
        "   "
      )
    );
    await fs.cp("src/lib/themes", "dist/themes", { recursive: true });
    console.log("*** Build finished succesfully ***");
  });
};

main();
