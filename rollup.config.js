import resolve from '@rollup/plugin-node-resolve'; // Resolves node_modules imports
import typescript from '@rollup/plugin-typescript'; // Compiles TypeScript files
import json from '@rollup/plugin-json'; // Allows importing JSON files
import commonjs from '@rollup/plugin-commonjs'; // Converts CommonJS modules to ES6
import { exec } from 'child_process';

import { createRequire } from 'module'; // Enables using require in ES modules

const require = createRequire(import.meta.url); // Creates a require function
const pkg = require('./package.json'); // Loads package.json for configuration

export default {
  input: 'index.ts', // Entry point of the library
  output: [
    { file: pkg.main, format: 'cjs', sourcemap: true, inlineDynamicImports: true }, // CommonJS output
    { file: pkg.module, format: 'esm', sourcemap: true, inlineDynamicImports: true } // ES module output
  ],
  external: [
    ...Object.keys(pkg.peerDependencies || {}), // Excludes peer dependencies from the bundle
  ],
  plugins: [
    json(), // Enables JSON imports
    resolve({ extensions: ['.mjs', '.js', '.ts'] }), // Resolves file extensions
    commonjs(), // Converts CommonJS to ES6
    typescript({ tsconfig: './tsconfig.prod.json' }) // Uses the specified TypeScript configuration
  ],
  watch: { // DEV only
    include: ['src/**', "index.ts"],
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
};
