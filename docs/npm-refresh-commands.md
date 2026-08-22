# NPM Refresh Commands

Clean reinstall of every declared NPM package. Remove the existing install and lockfile first, then reinstall the latest major versions of all packages.

## Clean existing install

```sh
rm -rf node_modules && rm -f package-lock.json
```

## Install peer dependencies

There are currently no packages in `peerDependencies`, so no peer-dependency install command is needed. When peer dependencies are added, install them with `npm install <packages> --save-peer` so they remain peer dependencies.

## Install development dependencies

```sh
npm install @types/node@latest vitest@latest @stylistic/eslint-plugin@latest eslint@latest typescript-eslint@latest @rollup/plugin-node-resolve@latest @rollup/plugin-typescript@latest rollup@latest tslib@latest vite@latest --save-dev
npm install typescript@6.0.3 --save-dev
```

TypeScript is pinned to the newest 6.x release because `typescript-eslint@8.67.0` requires TypeScript `<6.1.0` and the latest release is 7.x.