# NPM Refresh Commands

This document contains CLI commands for a clean reinstall of all NPM packages.
The process removes `node_modules` and `package-lock.json`, then reinstalls all
dependencies using the newest major versions available on the npm registry.

## Step 1 — Clean existing install

```bash
rm -rf node_modules && rm -f package-lock.json
```

## Step 2 — Install peerDependencies (runtime dependencies)

These packages are required at runtime by consumers of this library. They are kept
in `peerDependencies` using `--save-peer`.

```bash
npm install sqlite@latest sqlite3@latest lodash@latest luxon@latest pino@latest --save-peer
```

## Step 3 — Install devDependencies (development-only dependencies)

These packages are only needed during development, linting, building and testing.

```bash
npm install @types/lodash@latest @types/luxon@latest @types/node@latest vitest@latest vite@latest vite-tsconfig-paths@latest @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest typescript-eslint@latest eslint@latest eslint-plugin-node@latest @rollup/plugin-json@latest @rollup/plugin-node-resolve@latest @rollup/plugin-typescript@latest rollup@latest rollup-plugin-dts@latest typescript@latest tsc-alias@latest tsconfig-paths@latest tslib@latest ts-node@latest tsx@latest --save-dev
```
