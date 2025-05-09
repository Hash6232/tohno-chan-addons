import alias from "@rollup/plugin-alias";
import typescript from "@rollup/plugin-typescript";
import path from 'path';
import styles from "rollup-plugin-styler";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/tohno-chan-tweaks.js",
    format: "iife",
    sourcemap: true,
  },
  plugins: [
    alias({
      entries: [{ find: "@shared", replacement: path.resolve("src/shared") }],
    }),
    typescript({
      removeComments: true,
    }),
    styles({
      minimize: true,
      mode: ["inject", { singleTag: true }],
    }),
  ],
};
