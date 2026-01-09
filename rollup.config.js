import resolve from '@rollup/plugin-node-resolve'; // Resolves node_modules imports
import typescript from '@rollup/plugin-typescript'; // Compiles TypeScript files
import json from '@rollup/plugin-json'; // Allows importing JSON files
import { exec } from 'child_process';

import { createRequire } from 'module'; // Enables using require in ES modules

const require = createRequire(import.meta.url); // Creates a require function
const pkg = require('./package.json'); // Loads package.json for configuration

export default [
  {
    input: 'src/index.browser.ts', // Entry point of the library
    output: [
      { file: "./dist/index.browser.js", format: 'esm', sourcemap: true, inlineDynamicImports: true } // ES module output
    ],
    external: [
      ...Object.keys(pkg.peerDependencies || {}), // Excludes peer dependencies from the bundle
    ],
    plugins: [
      json(), // Enables JSON imports
      resolve({ extensions: ['.mjs', '.cjs', '.js', '.ts'] }), // Resolves file extensions
      typescript({ tsconfig: './tsconfig.prod.browser.json' }) // Uses the specified TypeScript configuration
    ],
    watch: { // DEV only
      include: ['src/**'],
      exclude: 'node_modules/**',
      clearScreen: false,
      buildDelay: 100,
      // chokidar: {
      //   usePolling: true,
      //   interval: 100
      // },

      onInvalidate(id) {
        console.log(`File changed: ${id}`);

        setTimeout(() => {
          exec('npm run yalc:publish:push', (error, stdout, stderr) => {
            if (error) {
              console.error(`Error: ${error.message}`);
              return;
            }
            if (stderr) {
              console.error(`Stderr: ${stderr}`);
              return;
            }
            console.log(`Stdout:\n${stdout}`);
          });
        }, 1500); // Delay execution
      }
    }
  },
  {
    input: 'src/index.node.ts', // Entry point of the library
    output: [
      { file: "./dist/index.node.js", format: 'esm', sourcemap: true, inlineDynamicImports: true }, // ES module output
      { file: "./dist/index.node.cjs", format: 'cjs', sourcemap: true, inlineDynamicImports: true } // CommonJS module output
    ],
    external: [
      ...Object.keys(pkg.peerDependencies || {}), // Excludes peer dependencies from the bundle
    ],
    plugins: [
      json(), // Enables JSON imports
      resolve({ extensions: ['.mjs', '.cjs', '.js', '.ts'] }), // Resolves file extensions
      typescript({ tsconfig: './tsconfig.prod.node.json' }) // Uses the specified TypeScript configuration
    ],
    watch: { // DEV only
      include: ['src/**'],
      exclude: 'node_modules/**',
      clearScreen: false,
      buildDelay: 100,
      // chokidar: {
      //   usePolling: true,
      //   interval: 100
      // },

      onInvalidate(id) {
        console.log(`File changed: ${id}`);

        setTimeout(() => {
          exec('npm run yalc:publish:push', (error, stdout, stderr) => {
            if (error) {
              console.error(`Error: ${error.message}`);
              return;
            }
            if (stderr) {
              console.error(`Stderr: ${stderr}`);
              return;
            }
            console.log(`Stdout:\n${stdout}`);
          });
        }, 1500); // Delay execution
      }
    }
  }
];
