import alias from "@rollup/plugin-alias";
import typescript from "@rollup/plugin-typescript";
import styles from "rollup-plugin-styler";

const createConfig = (filename, path) => ({
  input: path,
  output: {
    file: "dist/" + filename + "-addon.js",
    format: "iife",
    sourcemap: true,
  },
  plugins: [
    alias({
      entries: [{ find: "@shared", replacement: "src/shared" }],
    }),
    typescript({
      removeComments: true,
    }),
    styles({
      minimize: true,
      mode: ["inject", { container: "head", singleTag: true }],
    }),
  ],
});

export default [
  createConfig("posts", "src/addons/posts/index.ts"),
  createConfig("quick-reply", "src/addons/quick-reply/index.ts"),
];
