import alias from "@rollup/plugin-alias";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import fs from "fs";
import path from "path";
import { defineConfig } from "rollup";
import scss from "rollup-plugin-scss";

const sourceDir = "./src/addons";

const addons = fs
  .readdirSync(sourceDir)
  .map((name) => path.join(sourceDir, name))
  .filter((source) => fs.statSync(source).isDirectory())
  .map((directory) => [path.basename(directory), path.join(directory, "index.ts")]);

const outputs = addons.map(([addonName, inputFile]) => ({
  input: inputFile,
  output: {
    file: path.join("dist", addonName + "-addon.js"),
    format: "iife",
    sourcemap: true,
  },
  plugins: [
    alias({
      entries: [{ find: "@shared", replacement: path.resolve("./src/shared") }],
    }),
    typescript(),
    scss({
      output: false,
      insert: true,
      outputStyle: "compressed",
      silenceDeprecations: ["legacy-js-api"],
    }),
    terser(),
  ],
}));

export default defineConfig(outputs);
