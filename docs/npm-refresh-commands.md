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
npm install pino@^10.3.1 --save-peer
```

## Step 3 — Install devDependencies (development-only dependencies)

These packages are only needed during development, linting, building and testing.

```bash
npm install @types/node@^26.2.0 typescript-eslint@^8.67.0 @stylistic/eslint-plugin@^5.10.0 eslint@^10.8.1 @rollup/plugin-node-resolve@^16.0.3 @rollup/plugin-typescript@^12.3.0 rollup@^4.62.4 tslib@^2.8.1 typescript@^6.0.3 vite@^8.2.1 vitest@^4.1.10 --save-dev
```
