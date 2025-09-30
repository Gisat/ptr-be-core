import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths({configNames: ['tsconfig.base.json', 'tsconfig.dev.json']})],
    test: {
        globals: true,
        silent: false,
        environment: 'node',
        include: ['**/*.test.ts', '**/*.spec.ts'],
        exclude: ['**/node_modules/**', '**/dist/**'],
        testTimeout: 500000,
        dir: './tests',
        reporters: ['verbose'],
        hookTimeout: 100000,
    },
});
