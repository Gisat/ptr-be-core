import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { createRequire } from 'module';

const require = createRequire(import.meta.url); // Creates a require function
const pkg = require('./package.json'); // Loads package.json for configuration
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default [
    {
        input: 'index.ts',
        output: [
            {
                file: pkg.main,
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: pkg.module,
                format: 'es',
                sourcemap: true,
            }
        ],
        plugins: [json(), resolve({ extensions }), commonjs(), typescript({
            tsconfig: './tsconfig.json',
        })]
    }
];