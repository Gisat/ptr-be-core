# NPM Refresh Commands

This document contains the commands for a clean reinstall of every declared NPM package. Remove the existing install and lockfile first, then reinstall the latest compatible releases.

## Clean existing install

```sh
rm -rf node_modules && rm -f package-lock.json
```

## Install peer dependencies

There are currently no packages in `peerDependencies`, so no peer-dependency install command is needed. When peer dependencies are added, install them with `npm install <packages> --save-peer` so they remain peer dependencies.

## Install development dependencies

```sh
npm install @types/node@latest vitest@latest @stylistic/eslint-plugin@latest eslint@latest typescript-eslint@latest @rollup/plugin-node-resolve@latest @rollup/plugin-typescript@latest rollup@latest tslib@latest typescript@6.0.3 vite@latest --save-dev
```

TypeScript is pinned to the newest compatible 6.x release because `typescript-eslint@8.67.0` requires TypeScript `<6.1.0`.
