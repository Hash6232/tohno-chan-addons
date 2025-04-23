import fs from "fs";
import path from "path";
import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import scss from 'rollup-plugin-scss';
import terser from '@rollup/plugin-terser';

const inputFiles = fs.readdirSync("src")
  .filter((file) => file.endsWith('.ts')) 
  .map((file) => path.join("src", file));

const outputs = inputFiles.map((inputFile) => ({
    input: inputFile,
    output: {
        file: path.join('dist', path.basename(inputFile, ".ts") + ".js"),
        format: 'iife',
        sourcemap: true
    },
    plugins: [typescript(), scss({
      output: false,
      insert: true,
      outputStyle: 'compressed'
    }), terser()],
}));

export default defineConfig(outputs);