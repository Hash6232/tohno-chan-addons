import fs from "fs";
import path from "path";
import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';
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
    plugins: [
      typescript(),
      alias({
        entries: [
          { find: '@enums', replacement: './src/enums' },
          { find: '@features', replacement: './src/features' },
          { find: '@utils', replacement: './src/utils' }
        ]
      }),
      scss({
        output: false, 
        insert: true, 
        outputStyle: 'compressed',
        silenceDeprecations: ["legacy-js-api"]
      }),
      terser()
    ],
}));

export default defineConfig(outputs);