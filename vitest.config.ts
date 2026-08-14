import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        tsconfigPaths: true,
    },
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
